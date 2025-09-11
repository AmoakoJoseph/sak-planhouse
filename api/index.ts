import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lazy load storage to avoid database connection issues during module initialization
let storage: any = null;

async function getStorage() {
  if (!storage) {
    try {
      const { storage: storageModule } = await import('../server/storage');
      storage = storageModule;
    } catch (error) {
      console.error('Failed to load storage module:', error);
      throw new Error('Database connection failed');
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


