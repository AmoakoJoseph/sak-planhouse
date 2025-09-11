import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  throw new Error('DATABASE_URL is not set');
}

// Create the connection with serverless-friendly configuration
const client = postgres(process.env.DATABASE_URL, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

export const db = drizzle(client, { schema });

export * from '../shared/schema';