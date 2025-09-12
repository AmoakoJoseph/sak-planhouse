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

  constructor() {
    const url = assertEnv('SUPABASE_URL', process.env.SUPABASE_URL);
    const serviceKey = assertEnv('SUPABASE_SERVICE_KEY', process.env.SUPABASE_SERVICE_KEY);
    this.client = createClient(url, serviceKey);
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
    const { error } = await this.client.storage.from(this.bucketName).upload(path, buffer, {
      upsert: false,
      contentType: 'application/octet-stream',
    } as any);
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const publicUrl = this.getPublicUrl(path);
    return { filename, path, url: path, publicUrl };
  }

  async uploadPlanFile(buffer: Buffer, filename: string, tier: 'basic' | 'standard' | 'premium'): Promise<UploadResult> {
    await this.ensureBucket();
    const path = `plans/${tier}/${filename}`;
    const { error } = await this.client.storage.from(this.bucketName).upload(path, buffer, {
      upsert: false,
      contentType: 'application/octet-stream',
    } as any);
    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }
    const publicUrl = this.getPublicUrl(path);
    return { filename, path, url: path, publicUrl };
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


