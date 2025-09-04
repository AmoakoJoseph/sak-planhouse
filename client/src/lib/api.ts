// API client to replace Supabase calls
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface Plan {
  id: string;
  title: string;
  description: string | null;
  plan_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  basic_price: number;
  standard_price: number;
  premium_price: number;
  featured: boolean;
  status: string;
  image_url: string | null;
  gallery_images: any[] | null;
  plan_files: any | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  company: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  plan_id: string;
  tier: string;
  amount: number;
  status: string;
  payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  // Plans API
  async getPlans(filters?: { status?: string; featured?: boolean }): Promise<Plan[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());

    const response = await fetch(`${API_BASE}/plans?${params}`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  }

  async getPlan(id: string): Promise<Plan> {
    const response = await fetch(`${API_BASE}/plans/${id}`);
    if (!response.ok) throw new Error('Failed to fetch plan');
    return response.json();
  }

  async createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> {
    const response = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Failed to create plan');
    return response.json();
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan> {
    const response = await fetch(`${API_BASE}/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update plan');
    return response.json();
  }

  async deletePlan(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/plans/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete plan');
  }

  // Orders API
  async getOrders(userId?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    const response = await fetch(`${API_BASE}/orders?${params}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }

  // Profiles API
  async getProfile(userId: string): Promise<Profile> {
    const response = await fetch(`${API_BASE}/profiles/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const response = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const response = await fetch(`${API_BASE}/profiles/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  // Downloads API
  async getDownloadInfo(orderId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/downloads/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch download info');
    return response.json();
  }



  async downloadFile(orderId: string, filePath: string): Promise<Response> {
    const url = `${API_BASE}/downloads/${orderId}/file?filePath=${encodeURIComponent(filePath)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download file');
    return response;
  }

  // Payment API
  async initializePayment(paymentData: {
    email: string;
    amount: number;
    planId: string;
    planTitle: string;
    packageType: string;
    userId?: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE}/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to initialize payment');
    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    // Remove leading slash if present to avoid double /api/
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const response = await fetch(`${API_BASE}/${cleanEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to POST to ${endpoint}`);
    return response.json();
  }

  async get(endpoint: string): Promise<any> {
    // Remove leading slash if present to avoid double /api/
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const response = await fetch(`${API_BASE}/${cleanEndpoint}`);
    if (!response.ok) throw new Error(`Failed to GET from ${endpoint}`);
    return response.json();
  }
}

export const api = new ApiClient();