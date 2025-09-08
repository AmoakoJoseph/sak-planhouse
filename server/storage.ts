import { users, profiles, plans, orders, downloads, reviews, favorites, ads } from "@shared/schema";
import type { User, Profile, Plan, Order, Download, InsertUser, Review, InsertReview, Favorite, InsertFavorite, Ad, InsertAd } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

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

  // Downloads management
  getDownloads(userId?: string): Promise<Download[]>;
  recordDownload(download: Omit<Download, 'id' | 'downloaded_at'>): Promise<Download>;

  // Reviews management
  getReviewsByPlanId(planId: string): Promise<Review[]>;
  createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review>;
  updateReviewVotes(reviewId: string, isHelpful: boolean): Promise<Review | undefined>;

  // Favorites management
  getFavoritesByUserId(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, planId: string): Promise<Favorite>;
  removeFavorite(userId: string, planId: string): Promise<boolean>;
  isFavorite(userId: string, planId: string): Promise<boolean>;

  // Ads management
  getAds(filters?: { status?: string; ad_type?: string; position?: string }): Promise<Ad[]>;
  getAd(id: string): Promise<Ad | undefined>;
  createAd(ad: Omit<Ad, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count'>): Promise<Ad>;
  updateAd(id: string, updates: Partial<Ad>): Promise<Ad | undefined>;
  deleteAd(id: string): Promise<boolean>;
  incrementAdViews(id: string): Promise<void>;
  incrementAdClicks(id: string): Promise<void>;
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
    // Use returning() so we can reliably know how many rows were deleted
    const result = await db.delete(plans)
      .where(eq(plans.id, id))
      .returning();
    return result.length > 0;
  }

  // Orders methods
  async getOrders(userId?: string): Promise<any[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(orders.user_id, userId));
    }

    const result = await db.select({
      id: orders.id,
      user_id: orders.user_id,
      plan_id: orders.plan_id,
      tier: orders.tier,
      amount: orders.amount,
      status: orders.status,
      payment_intent_id: orders.payment_intent_id,
      created_at: orders.created_at,
      updated_at: orders.updated_at,
      // Plan information
      plan_title: plans.title,
      plan_type: plans.plan_type,
      // User information
      user_email: profiles.email,
      user_first_name: profiles.first_name,
      user_last_name: profiles.last_name,
    })
    .from(orders)
    .leftJoin(plans, eq(orders.plan_id, plans.id))
    .leftJoin(profiles, eq(orders.user_id, profiles.user_id))
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

  // Downloads methods
  async getDownloads(userId?: string): Promise<Download[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(downloads.user_id, userId));
    }

    const result = await db.select().from(downloads)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(downloads.last_downloaded));

    return result;
  }

  async recordDownload(download: Omit<Download, 'id' | 'last_downloaded'>): Promise<Download> {
    const result = await db.insert(downloads).values({
      ...download,
      last_downloaded: new Date(),
    }).returning();
    return result[0];
  }

  // Reviews methods
  async getReviewsByPlanId(planId: string): Promise<Review[]> {
    const result = await db.select().from(reviews)
      .where(eq(reviews.plan_id, planId))
      .orderBy(desc(reviews.created_at));
    return result;
  }

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    const result = await db.insert(reviews).values({
      ...review,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return result[0];
  }

  async updateReviewVotes(reviewId: string, isHelpful: boolean): Promise<Review | undefined> {
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    if (!review[0]) return undefined;

    const updates = isHelpful 
      ? { helpful_votes: review[0].helpful_votes + 1 }
      : { unhelpful_votes: review[0].unhelpful_votes + 1 };

    const result = await db.update(reviews)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(reviews.id, reviewId))
      .returning();
    return result[0];
  }

  // Favorites methods
  async getFavoritesByUserId(userId: string): Promise<Favorite[]> {
    const result = await db.select().from(favorites)
      .where(eq(favorites.user_id, userId))
      .orderBy(desc(favorites.created_at));
    return result;
  }

  async addFavorite(userId: string, planId: string): Promise<Favorite> {
    const result = await db.insert(favorites).values({
      user_id: userId,
      plan_id: planId,
      created_at: new Date(),
    }).returning();
    return result[0];
  }

  async removeFavorite(userId: string, planId: string): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(and(eq(favorites.user_id, userId), eq(favorites.plan_id, planId)))
      .returning();
    return result.length > 0;
  }

  async isFavorite(userId: string, planId: string): Promise<boolean> {
    const result = await db.select().from(favorites)
      .where(and(eq(favorites.user_id, userId), eq(favorites.plan_id, planId)))
      .limit(1);
    return result.length > 0;
  }

  // Analytics methods
  async getAnalytics(): Promise<any> {
    try {
      // Get total revenue from completed orders
      const revenueResult = await db.select({
        totalRevenue: sql<number>`SUM(${orders.amount})`.mapWith(Number),
        totalOrders: sql<number>`COUNT(*)`.mapWith(Number),
      }).from(orders).where(eq(orders.status, 'completed'));

      // Get total users count
      const usersResult = await db.select({
        totalUsers: sql<number>`COUNT(*)`.mapWith(Number),
      }).from(profiles);

      // Get total downloads count
      const downloadsResult = await db.select({
        totalDownloads: sql<number>`COUNT(*)`.mapWith(Number),
      }).from(downloads);

      // Get plan metrics
      const planMetricsResult = await db.select({
        packageType: orders.tier,
        count: sql<number>`COUNT(*)`.mapWith(Number),
      }).from(orders)
        .where(eq(orders.status, 'completed'))
        .groupBy(orders.tier);

      // Get recent activity (orders)
      const recentOrdersResult = await db.select().from(orders)
        .orderBy(desc(orders.created_at))
        .limit(10);

      // Get top plans by sales
      const topPlansResult = await db.select({
        planId: orders.plan_id,
        sales: sql<number>`COUNT(*)`.mapWith(Number),
        revenue: sql<number>`SUM(${orders.amount})`.mapWith(Number),
      }).from(orders)
        .where(eq(orders.status, 'completed'))
        .groupBy(orders.plan_id)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(5);

      const totalRevenue = revenueResult[0]?.totalRevenue || 0;
      const totalOrders = revenueResult[0]?.totalOrders || 0;
      const totalUsers = usersResult[0]?.totalUsers || 0;
      const totalDownloads = downloadsResult[0]?.totalDownloads || 0;

      // Calculate plan metrics
      const planMetrics = {
        basicSales: planMetricsResult.find(p => p.packageType === 'basic')?.count || 0,
        standardSales: planMetricsResult.find(p => p.packageType === 'standard')?.count || 0,
        premiumSales: planMetricsResult.find(p => p.packageType === 'premium')?.count || 0,
        totalPlans: await db.select({ count: sql<number>`COUNT(*)`.mapWith(Number) }).from(plans).then(r => r[0]?.count || 0),
      };

      // Format recent activity
      const recentActivity = recentOrdersResult.map((order, index) => ({
        id: order.id,
        type: 'order' as const,
        description: `${order.tier} package purchased`,
        timestamp: new Date(order.created_at).toLocaleString(),
        amount: order.amount,
      }));

      // Get plan details for top plans
      const topPlans = await Promise.all(
        topPlansResult.map(async (topPlan) => {
          const plan = await this.getPlan(topPlan.planId);
          return {
            id: topPlan.planId,
            title: plan?.title || 'Unknown Plan',
            sales: topPlan.sales,
            revenue: topPlan.revenue,
            category: plan?.plan_type || 'Unknown',
          };
        })
      );

      return {
        overview: {
          totalRevenue,
          revenueGrowth: 12.5, // Mock growth percentage
          totalOrders,
          ordersGrowth: 8.2, // Mock growth percentage
          totalUsers,
          usersGrowth: 15.3, // Mock growth percentage
          totalDownloads,
          downloadsGrowth: 22.1, // Mock growth percentage
        },
        planMetrics,
        recentActivity,
        topPlans,
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  // Users methods
  async getAllUsers(): Promise<any[]> {
    try {
      const result = await db.select({
        id: profiles.id,
        userId: profiles.user_id,
        email: profiles.email,
        firstName: profiles.first_name,
        lastName: profiles.last_name,
        role: profiles.role,
        createdAt: profiles.created_at,
        updatedAt: profiles.updated_at,
      }).from(profiles).orderBy(desc(profiles.created_at));

      return result;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, newRole: string): Promise<Profile | undefined> {
    try {
      const result = await db.update(profiles)
        .set({ 
          role: newRole,
          updated_at: new Date()
        })
        .where(eq(profiles.user_id, userId))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Ads methods
  async getAds(filters?: { status?: string; ad_type?: string; position?: string }): Promise<Ad[]> {
    try {
      const conditions = [];
      
      if (filters?.status) {
        conditions.push(eq(ads.status, filters.status));
      }
      if (filters?.ad_type) {
        conditions.push(eq(ads.ad_type, filters.ad_type));
      }
      if (filters?.position) {
        conditions.push(eq(ads.position, filters.position));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const result = await db.select().from(ads).where(whereClause).orderBy(desc(ads.created_at));
      return result;
    } catch (error) {
      console.error('Error getting ads:', error);
      throw error;
    }
  }

  async getAd(id: string): Promise<Ad | undefined> {
    try {
      const result = await db.select().from(ads).where(eq(ads.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting ad:', error);
      throw error;
    }
  }

  async createAd(ad: Omit<Ad, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count'>): Promise<Ad> {
    try {
      // Clean the ad data to ensure proper types
      const cleanAd = {
        title: ad.title,
        description: ad.description || null,
        image_url: ad.image_url || null,
        link_url: ad.link_url || null,
        ad_type: ad.ad_type,
        position: ad.position,
        status: ad.status,
        start_date: ad.start_date ? new Date(ad.start_date) : null,
        end_date: ad.end_date ? new Date(ad.end_date) : null,
      };

      const result = await db.insert(ads).values({
        ...cleanAd,
        click_count: 0,
        view_count: 0,
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  async updateAd(id: string, updates: Partial<Ad>): Promise<Ad | undefined> {
    try {
      const updateData: any = { ...updates, updated_at: new Date() };
      
      // Convert date strings to Date objects if they exist
      if (updates.start_date) {
        updateData.start_date = new Date(updates.start_date);
      }
      if (updates.end_date) {
        updateData.end_date = new Date(updates.end_date);
      }
      
      const result = await db.update(ads)
        .set(updateData)
        .where(eq(ads.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating ad:', error);
      throw error;
    }
  }

  async deleteAd(id: string): Promise<boolean> {
    try {
      const result = await db.delete(ads).where(eq(ads.id, id));
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting ad:', error);
      throw error;
    }
  }

  async incrementAdViews(id: string): Promise<void> {
    try {
      await db.update(ads)
        .set({ 
          view_count: sql`${ads.view_count} + 1`,
          updated_at: new Date()
        })
        .where(eq(ads.id, id));
    } catch (error) {
      console.error('Error incrementing ad views:', error);
      throw error;
    }
  }

  async incrementAdClicks(id: string): Promise<void> {
    try {
      await db.update(ads)
        .set({ 
          click_count: sql`${ads.click_count} + 1`,
          updated_at: new Date()
        })
        .where(eq(ads.id, id));
    } catch (error) {
      console.error('Error incrementing ad clicks:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();