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

// Add a simple auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoints are working!', 
    timestamp: new Date().toISOString(),
    endpoints: ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
  });
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

// Authentication endpoints
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }
    
    console.log('Sign in attempt for email:', email);
    
    // For now, return a mock successful response
    // TODO: Implement actual authentication logic
    res.json({
      success: true,
      message: "Sign in successful",
      user: {
        id: "1",
        email: email,
        name: "Test User"
      }
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ 
      error: "Sign in failed",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: "Email, password, and name are required" 
      });
    }
    
    console.log('Sign up attempt for email:', email);
    
    // For now, return a mock successful response
    // TODO: Implement actual registration logic
    res.json({
      success: true,
      message: "Sign up successful",
      user: {
        id: "1",
        email: email,
        name: name
      }
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ 
      error: "Sign up failed",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/auth/signout", async (req, res) => {
  try {
    console.log('Sign out request');
    
    // For now, return a mock successful response
    // TODO: Implement actual sign out logic
    res.json({
      success: true,
      message: "Sign out successful"
    });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({ 
      error: "Sign out failed",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Individual Plan API
app.get("/api/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching plan with ID:', id);
    
    // Get a single plan by ID
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    const result = await client.unsafe('SELECT * FROM plans WHERE id = $1', [id]);
    await client.end();
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ 
      error: "Failed to fetch plan",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Orders API
app.get("/api/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('Fetching orders for user:', userId);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    let query = 'SELECT * FROM orders';
    const params: any[] = [];
    
    if (userId) {
      query += ' WHERE user_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await client.unsafe(query, params);
    await client.end();
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      error: "Failed to fetch orders",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    console.log('Creating order:', orderData);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    const result = await client.unsafe(
      'INSERT INTO orders (user_id, plan_id, tier, amount, status, payment_intent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [orderData.user_id, orderData.plan_id, orderData.tier, orderData.amount, orderData.status || 'pending', orderData.payment_intent_id]
    );
    await client.end();
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      error: "Failed to create order",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Profiles API
app.get("/api/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching profile for user:', userId);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    const result = await client.unsafe('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    await client.end();
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ 
      error: "Failed to fetch profile",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post("/api/profiles", async (req, res) => {
  try {
    const profileData = req.body;
    console.log('Creating profile:', profileData);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    const result = await client.unsafe(
      'INSERT INTO profiles (user_id, email, first_name, last_name, phone, role, address, city, country, bio, company, website, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) RETURNING *',
      [profileData.user_id, profileData.email, profileData.first_name, profileData.last_name, profileData.phone, profileData.role || 'user', profileData.address, profileData.city, profileData.country, profileData.bio, profileData.company, profileData.website]
    );
    await client.end();
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ 
      error: "Failed to create profile",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put("/api/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    console.log('Updating profile for user:', userId, updates);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'user_id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [userId, ...fields.map(field => updates[field])];
    
    const result = await client.unsafe(
      `UPDATE profiles SET ${setClause}, updated_at = NOW() WHERE user_id = $1 RETURNING *`,
      values
    );
    await client.end();
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      error: "Failed to update profile",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Downloads API
app.get("/api/downloads/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('Fetching download info for order:', orderId);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
    
    const result = await client.unsafe('SELECT * FROM downloads WHERE order_id = $1', [orderId]);
    await client.end();
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching download info:", error);
    res.status(500).json({ 
      error: "Failed to fetch download info",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get("/api/downloads/:orderId/file", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { filePath } = req.query;
    console.log('Downloading file for order:', orderId, 'file:', filePath);
    
    // For now, return a mock response
    // TODO: Implement actual file download logic
    res.json({
      success: true,
      message: "File download initiated",
      orderId,
      filePath
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ 
      error: "Failed to download file",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Payment API
app.post("/api/payments/initialize", async (req, res) => {
  try {
    const paymentData = req.body;
    console.log('Initializing payment:', paymentData);
    
    // For now, return a mock response
    // TODO: Implement actual Paystack payment initialization
    res.json({
      success: true,
      message: "Payment initialized",
      reference: `ref_${Date.now()}`,
      authorization_url: "https://checkout.paystack.com/mock-checkout"
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ 
      error: "Failed to initialize payment",
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


