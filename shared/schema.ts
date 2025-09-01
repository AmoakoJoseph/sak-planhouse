import { pgTable, text, serial, integer, boolean, decimal, timestamp, uuid, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Enums
export const userRoleEnum = pgTable("user_role", {
  value: text("value")
});

export const planTypeEnum = pgTable("plan_type", {
  value: text("value")
});

export const planTierEnum = pgTable("plan_tier", {
  value: text("value")
});

export const orderStatusEnum = pgTable("order_status", {
  value: text("value")
});

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull().unique(),
  email: text("email").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  phone: text("phone"),
  role: text("role").notNull().default("user"), // 'user', 'admin', 'super_admin'
  avatar_url: text("avatar_url"),
  address: text("address"),
  city: text("city"),
  country: text("country").default("Ghana"),
  bio: text("bio"),
  company: text("company"),
  website: text("website"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  plan_type: text("plan_type").notNull(), // 'villa', 'bungalow', 'townhouse', 'duplex', 'apartment', 'commercial'
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area_sqft: integer("area_sqft"),
  basic_price: decimal("basic_price", { precision: 10, scale: 2 }).notNull().default("0"),
  standard_price: decimal("standard_price", { precision: 10, scale: 2 }).notNull().default("0"),
  premium_price: decimal("premium_price", { precision: 10, scale: 2 }).notNull().default("0"),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("active"),
  image_url: text("image_url"),
  gallery_images: json("gallery_images"),
  plan_files: json("plan_files"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull(),
  plan_id: uuid("plan_id").notNull(),
  tier: text("tier").notNull(), // 'basic', 'standard', 'premium'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'cancelled', 'refunded'
  payment_intent_id: text("payment_intent_id"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").notNull(),
  plan_id: uuid("plan_id").notNull(),
  order_id: uuid("order_id").notNull(),
  download_count: integer("download_count").notNull().default(0),
  last_downloaded: timestamp("last_downloaded"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles);
export const insertPlanSchema = createInsertSchema(plans);
export const insertOrderSchema = createInsertSchema(orders);
export const insertDownloadSchema = createInsertSchema(downloads);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Download = typeof downloads.$inferSelect;
