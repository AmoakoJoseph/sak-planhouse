import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a simple health check for the API first
app.get('/api/health', (req, res) => {
  console.log('Health check called');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPaystackKey: !!process.env.PAYSTACK_SECRET_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
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

// Register all routes asynchronously
(async () => {
  try {
    const { registerRoutes } = await import('../server/routes');
    await registerRoutes(app);
    console.log('Routes registered successfully');
  } catch (error) {
    console.error('Error registering routes:', error);
  }
})();

export default app;


