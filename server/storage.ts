import { users, profiles, plans, orders, downloads } from "@shared/schema";
import type { User, Profile, Plan, Order, Download, InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile management
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Plans management
  getPlans(filters?: { status?: string; featured?: boolean }): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan>;
  updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | undefined>;
  deletePlan(id: string): Promise<boolean>;
  
  // Orders management
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.user_id, userId)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const result = await db.update(profiles)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(profiles.user_id, userId))
      .returning();
    return result[0];
  }

  // Plans methods
  async getPlans(filters?: { status?: string; featured?: boolean }): Promise<Plan[]> {
    let conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(plans.status, filters.status));
    }
    
    const result = await db.select().from(plans)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(plans.featured), desc(plans.created_at));
    
    return result;
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
    return result[0];
  }

  async createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> {
    const result = await db.insert(plans).values(plan).returning();
    return result[0];
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | undefined> {
    const result = await db.update(plans)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(plans.id, id))
      .returning();
    return result[0];
  }

  async deletePlan(id: string): Promise<boolean> {
    const result = await db.delete(plans).where(eq(plans.id, id));
    return result.length > 0;
  }

  // Orders methods
  async getOrders(userId?: string): Promise<Order[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(eq(orders.user_id, userId));
    }
    
    const result = await db.select().from(orders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(orders.created_at));
    
    return result;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const result = await db.insert(orders).values({
      ...order,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return result[0];
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
