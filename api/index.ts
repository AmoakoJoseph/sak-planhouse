import express from 'express';
import postgres from 'postgres';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple getPlans function using direct postgres connection
async function getPlans(filters: { status?: string; featured?: boolean } = {}) {
  let client: postgres.Sql | null = null;
  
  try {
    console.log('Connecting to database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }

    // Create a new connection for each request (serverless-friendly)
    client = postgres(process.env.DATABASE_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
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
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const result = await client.unsafe(query, params);
    console.log('Query successful, found', result.length, 'plans');
    
    return result;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.end();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
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


