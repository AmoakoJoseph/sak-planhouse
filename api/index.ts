import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, desc } from 'drizzle-orm';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inline database setup to avoid import issues
let db: any = null;

async function getDatabase() {
  if (!db) {
    try {
      console.log('Initializing database connection...');
      
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
      }

      // Create the connection with serverless-friendly configuration
      const client = postgres(process.env.DATABASE_URL, {
        max: 1, // Limit connections for serverless
        idle_timeout: 20,
        connect_timeout: 10,
        ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
      });

      // Simple schema for plans table
      const plansSchema = {
        id: 'text',
        title: 'text',
        description: 'text',
        plan_type: 'text',
        bedrooms: 'integer',
        bathrooms: 'integer',
        area_sqft: 'integer',
        basic_price: 'decimal',
        standard_price: 'decimal',
        premium_price: 'decimal',
        featured: 'boolean',
        status: 'text',
        image_url: 'text',
        gallery_images: 'json',
        plan_files: 'json',
        created_at: 'timestamp',
        updated_at: 'timestamp'
      };

      db = drizzle(client, { schema: { plans: plansSchema } });
      console.log('Database connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return db;
}

// Simple getPlans function
async function getPlans(filters: { status?: string; featured?: boolean } = {}) {
  try {
    const database = await getDatabase();
    
    // Simple query using raw SQL to avoid schema issues
    const client = database.client;
    let query = 'SELECT * FROM plans WHERE 1=1';
    const params: any[] = [];
    
    if (filters.status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(filters.status);
    }
    
    if (filters.featured !== undefined) {
      query += ' AND featured = $' + (params.length + 1);
      params.push(filters.featured);
    }
    
    query += ' ORDER BY featured DESC, created_at DESC';
    
    const result = await client.unsafe(query, params);
    return result;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
}

// Add a simple health check for the API first
app.get('/api/health', async (req, res) => {
  try {
    console.log('Health check called');
    
    // Test database connection
    let dbStatus = 'unknown';
    try {
      await getPlans({});
      dbStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
      dbStatus = 'error';
    }
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: dbStatus,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPaystackKey: !!process.env.PAYSTACK_SECRET_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Add a database test route
app.get('/api/db-test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('Testing getPlans...');
    
    // Try a simple query
    const plans = await getPlans({});
    console.log('Database query successful, found', plans.length, 'plans');
    
    res.json({ 
      status: 'success', 
      message: 'Database connection working',
      plansCount: plans.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Plans API - register directly
app.get("/api/plans", async (req, res) => {
  try {
    const { status, featured } = req.query;
    const filters: { status?: string; featured?: boolean } = {};
    
    if (status) filters.status = status as string;
    if (featured) filters.featured = featured === 'true';
    
    const plans = await getPlans(filters);
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ 
      error: "Failed to fetch plans",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Serverless function error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;


