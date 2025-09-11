import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lazy load storage to avoid database connection issues during module initialization
let storage: any = null;

async function getStorage() {
  if (!storage) {
    try {
      console.log('Loading storage module...');
      const { storage: storageModule } = await import('../server/storage');
      storage = storageModule;
      console.log('Storage module loaded successfully');
    } catch (error) {
      console.error('Failed to load storage module:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return storage;
}

// Add a simple health check for the API first
app.get('/api/health', async (req, res) => {
  try {
    console.log('Health check called');
    
    // Test database connection
    let dbStatus = 'unknown';
    try {
      const storageInstance = await getStorage();
      await storageInstance.getPlans({});
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
    const storageInstance = await getStorage();
    console.log('Storage instance obtained, testing getPlans...');
    
    // Try a simple query
    const plans = await storageInstance.getPlans({});
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
    
    const storageInstance = await getStorage();
    const plans = await storageInstance.getPlans(filters);
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


