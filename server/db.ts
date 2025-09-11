import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  throw new Error('DATABASE_URL is not set');
}

console.log('Initializing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Create the connection with serverless-friendly configuration
let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

try {
  client = postgres(process.env.DATABASE_URL, {
    max: 1, // Limit connections for serverless
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    onnotice: (notice) => console.log('Postgres notice:', notice),
    onparameter: (key, value) => console.log('Postgres parameter:', key, value),
  });

  db = drizzle(client, { schema });
  console.log('Database connection initialized successfully');
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  throw error;
}

export { db };

export * from '../shared/schema';