import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type UploadResult = {
  filename: string;
  path: string;
  url: string;
  publicUrl: string;
};

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export class SupabaseStorageService {
  private client: SupabaseClient;
  private bucketName = 'sak-constructions';
  private isServiceRole = false;

  constructor() {
    const url = assertEnv('SUPABASE_URL', process.env.SUPABASE_URL);
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    const keyToUse = serviceKey || anonKey;
    if (!keyToUse) {
      throw new Error('Missing required env var: SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY');
    }

    this.isServiceRole = Boolean(serviceKey);
    if (!this.isServiceRole) {
      // eslint-disable-next-line no-console
      console.warn('Using SUPABASE_ANON_KEY for storage uploads. Ensure bucket exists and policies allow uploads in development.');
    }

    this.client = createClient(url, keyToUse);
  }

  public generateUniqueFilename(originalName: string): string {
    const dotIndex = originalName.lastIndexOf('.');
    const ext = dotIndex !== -1 ? originalName.slice(dotIndex) : '';
    const base = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    return `${base}-${unique}${ext}`;
  }

  private getPublicUrl(filePath: string): string {
    const { data } = this.client.storage.from(this.bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async ensureBucket(): Promise<void> {
    // Only service role can create/list buckets
    if (!this.isServiceRole) {
      return;
    }
    const { data: list, error: listError } = await this.client.storage.listBuckets();
    if (listError) {
      // Non-fatal; attempt to create anyway
      // eslint-disable-next-line no-console
      console.warn('Supabase listBuckets error:', listError.message);
    }
    const exists = list?.some(b => b.name === this.bucketName);
    if (!exists) {
      const { error } = await this.client.storage.createBucket(this.bucketName, {
        public: true,
      });
      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }
    }
  }

  async uploadImage(buffer: Buffer, filename: string, folder = 'images'): Promise<UploadResult> {
    await this.ensureBucket();
    const path = `${folder}/${filename}`;
    
    // Determine content type based on file extension
    const contentType = this.getContentType(filename);
    
    const { error } = await this.client.storage.from(this.bucketName).upload(path, buffer, {
      upsert: false,
      contentType,
    } as any);
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const publicUrl = this.getPublicUrl(path);
    return { filename, path, url: path, publicUrl };
  }

  private getContentType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'dwg': 'application/dwg',
      'dxf': 'application/dxf',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
    };
    return contentTypes[ext || ''] || 'application/octet-stream';
  }

  async uploadPlanFile(buffer: Buffer, filename: string, tier: 'basic' | 'standard' | 'premium'): Promise<UploadResult> {
    await this.ensureBucket();
    const path = `plans/${tier}/${filename}`;
    
    // Determine content type based on file extension
    const contentType = this.getContentType(filename);
    
    const { error } = await this.client.storage.from(this.bucketName).upload(path, buffer, {
      upsert: false,
      contentType,
    } as any);
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const publicUrl = this.getPublicUrl(path);
    return { filename, path, url: path, publicUrl };
  }

  async uploadGalleryImage(buffer: Buffer, filename: string): Promise<UploadResult> {
    return this.uploadImage(buffer, filename, 'gallery');
  }

  async uploadMultiple(items: Array<{ buffer: Buffer; filename: string; folder: string }>): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const item of items) {
      const res = await this.uploadImage(item.buffer, item.filename, item.folder);
      results.push(res);
    }
    return results;
  }

  async deleteFile(path: string): Promise<boolean> {
    await this.ensureBucket();
    const { error } = await this.client.storage.from(this.bucketName).remove([path]);
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Supabase delete error:', error.message);
      return false;
    }
    return true;
  }
}

export const supabaseStorage = new SupabaseStorageService();


