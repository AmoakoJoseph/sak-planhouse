import express from 'express';
import postgres from 'postgres';
import multer from 'multer';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In serverless, use in-memory uploads
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

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
      ssl: 'require', // Supabase requires SSL even in development
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

// Users API endpoint
app.get('/api/users', async (req, res) => {
  try {
    // For now, return mock user data
    // TODO: Implement actual user fetching from database
    const mockUsers = [
      {
        id: '1',
        user_id: '1',
        email: 'admin@sakconstructionsgh.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ];
    
    res.json(mockUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Portfolio API endpoints
app.get('/api/portfolio', async (req, res) => {
  try {
    // For now, return sample portfolio data
    // TODO: Implement actual portfolio fetching from database
    const samplePortfolio = [
      {
        id: '1',
        title: 'Modern Villa Design',
        category: 'Residential',
        summary: 'Contemporary 4-bedroom villa with open-plan living and sustainable features',
        description: 'A stunning modern villa featuring clean lines, large windows, and eco-friendly materials. The design emphasizes natural light and seamless indoor-outdoor living.',
        design_image: '/client/assets/villa-plan.jpg',
        current_image: '/client/assets/villa-plan.jpg',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Commercial Office Complex',
        category: 'Commercial',
        summary: 'Multi-story office building with modern amenities and green building certification',
        description: 'A state-of-the-art commercial complex designed for efficiency and sustainability. Features include solar panels, rainwater harvesting, and smart building systems.',
        design_image: '/client/assets/hero-construction.jpg',
        current_image: '/client/assets/hero-construction.jpg',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Townhouse Development',
        category: 'Residential',
        summary: 'Affordable housing development with modern amenities and community spaces',
        description: 'A thoughtfully designed townhouse community that balances affordability with quality. Each unit features modern finishes and energy-efficient systems.',
        design_image: '/client/assets/townhouse-plan.jpg',
        current_image: '/client/assets/townhouse-plan.jpg',
        status: 'in-progress',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Bungalow Renovation',
        category: 'Renovation',
        summary: 'Complete renovation of traditional bungalow with modern extensions',
        description: 'A comprehensive renovation project that preserved the original character while adding modern conveniences and expanding living space.',
        design_image: '/client/assets/bungalow-plan.jpg',
        current_image: '/client/assets/bungalow-plan.jpg',
        status: 'completed',
        created_at: new Date().toISOString()
      }
    ];
    
    res.json(samplePortfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sample portfolio items for individual requests
    const sampleItems = {
      '1': {
        id: '1',
        title: 'Modern Villa Design',
        category: 'Residential',
        summary: 'Contemporary 4-bedroom villa with open-plan living and sustainable features',
        description: 'A stunning modern villa featuring clean lines, large windows, and eco-friendly materials. The design emphasizes natural light and seamless indoor-outdoor living. This project showcases our commitment to sustainable architecture and modern design principles.',
        design_image: '/client/assets/villa-plan.jpg',
        current_image: '/client/assets/villa-plan.jpg',
        status: 'completed',
        created_at: new Date().toISOString(),
        features: [
          '4 bedrooms with ensuite bathrooms',
          'Open-plan living and dining area',
          'Modern kitchen with island',
          'Solar panel system',
          'Rainwater harvesting',
          'Smart home automation'
        ],
        specifications: {
          'Total Area': '450 sqm',
          'Bedrooms': '4',
          'Bathrooms': '5',
          'Parking': '2 cars',
          'Completion': '2023'
        }
      },
      '2': {
        id: '2',
        title: 'Commercial Office Complex',
        category: 'Commercial',
        summary: 'Multi-story office building with modern amenities and green building certification',
        description: 'A state-of-the-art commercial complex designed for efficiency and sustainability. Features include solar panels, rainwater harvesting, and smart building systems.',
        design_image: '/client/assets/hero-construction.jpg',
        current_image: '/client/assets/hero-construction.jpg',
        status: 'completed',
        created_at: new Date().toISOString()
      }
    };
    
    const item = sampleItems[id as keyof typeof sampleItems];
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Portfolio item not found' });
    }
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

// Portfolio CRUD endpoints for admin
app.post('/api/portfolio', async (req, res) => {
  try {
    const portfolioData = req.body;
    console.log('Creating portfolio item:', portfolioData);
    
    // For now, return mock created item
    const newItem = {
      id: Date.now().toString(),
      ...portfolioData,
      created_at: new Date().toISOString()
    };
    
    res.json(newItem);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log('Updating portfolio item:', id, updateData);
    
    // For now, return mock updated item
    const updatedItem = {
      id,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting portfolio item:', id);
    
    // For now, return success
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// User favorites endpoint
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching favorites for user:', userId);
    
    // For now, return empty favorites array
    // TODO: Implement actual favorites fetching from database
    res.json([]);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// User analytics endpoint
app.get('/api/analytics/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching user analytics for user:', userId);
    
    // For now, return mock user analytics data
    // TODO: Implement actual user analytics fetching from database
    const mockAnalytics = {
      userId: userId,
      totalOrders: 0,
      totalSpent: 0,
      favoritePlans: [],
      recentActivity: [],
      accountCreated: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    res.json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Add a simple auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoints are working!', 
    timestamp: new Date().toISOString(),
    endpoints: ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
  });
});

// Ads API (minimal) – mirrors server/routes.ts shape at a basic level
app.get('/api/ads', async (req, res) => {
  try {
    const { is_active, position, type, target_page } = req.query as Record<string, string | undefined>;

    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require', // Supabase requires SSL even in development
    });

    const filters: string[] = [];
    const params: any[] = [];
    if (is_active !== undefined) { filters.push(`is_active = $${params.length + 1}`); params.push(is_active === 'true'); }
    if (position) { filters.push(`position = $${params.length + 1}`); params.push(position); }
    if (type) { filters.push(`type = $${params.length + 1}`); params.push(type); }
    if (target_page) { filters.push(`(target_page = $${params.length + 1} OR target_page = 'all')`); params.push(target_page); }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `SELECT * FROM ads ${where} ORDER BY priority DESC, created_at DESC`;
    const ads = await client.unsafe(query, params);
    await client.end();

    res.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Analytics API (minimal)
app.get('/api/analytics', async (_req, res) => {
  try {
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require', // Supabase requires SSL even in development
    });

    const revenue = await client.unsafe(`SELECT COALESCE(SUM(amount),0)::decimal as total FROM orders WHERE status = 'completed'`);
    const users = await client.unsafe(`SELECT COUNT(*)::int as total FROM profiles`);
    const downloads = await client.unsafe(`SELECT COUNT(*)::int as total FROM downloads`);
    await client.end();
      
      res.json({
      overview: {
        totalRevenue: Number(revenue[0]?.total || 0),
        revenueGrowth: 12.5,
        totalOrders: 0,
        ordersGrowth: 8.2,
        totalUsers: Number(users[0]?.total || 0),
        usersGrowth: 15.3,
        totalDownloads: Number(downloads[0]?.total || 0),
        downloadsGrowth: 22.1
      },
      planMetrics: { basicSales: 0, standardSales: 0, premiumSales: 0, totalPlans: 0 },
      recentActivity: [],
      topPlans: []
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Ad tracking endpoints (minimal)
app.post('/api/ads/:id/impression', async (req, res) => {
  try {
    const { id } = req.params;
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require', // Supabase requires SSL even in development
    });
    // Try to increment if the column exists; otherwise ignore
    try {
      await client.unsafe(`UPDATE ads SET impressions = COALESCE(impressions, 0) + 1 WHERE id = $1`, [id]);
    } catch {}
    await client.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording ad impression:', error);
    res.status(200).json({ success: true }); // do not break UI if schema missing
  }
});

// Upload endpoints (mirror dev behavior using Supabase storage)
app.post('/api/upload/image', memoryUpload.single('image'), async (req, res) => {
  try {
    console.log('Image upload endpoint hit');
    console.log('Request file:', req.file ? { 
      originalname: req.file.originalname, 
      mimetype: req.file.mimetype, 
      size: req.file.size 
    } : 'No file');
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_ANON_KEY)) {
      console.log('Supabase not configured, returning mock response');
      const mockFilename = `image-${Date.now()}-${Math.floor(Math.random() * 1e9)}.${req.file.originalname.split('.').pop() || 'jpg'}`;
      return res.json({ 
        filename: mockFilename, 
        path: `images/${mockFilename}`, 
        url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(req.file.originalname)}`,
        publicUrl: `https://via.placeholder.com/400x300?text=${encodeURIComponent(req.file.originalname)}`
      });
    }
    
    console.log('Importing supabase storage...');
    const { supabaseStorage } = await import('../server/supabase-storage');
    console.log('Supabase storage imported successfully');
    
    console.log('Generating unique filename...');
    const filename = supabaseStorage.generateUniqueFilename(req.file.originalname);
    console.log('Generated filename:', filename);
    
    console.log('Uploading to Supabase...');
    const result = await supabaseStorage.uploadImage(req.file.buffer, filename, 'images');
    console.log('Upload successful:', result);
    
    res.json({ filename: result.filename, path: result.path, url: result.publicUrl });
  } catch (error) {
    console.error('Upload image error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      cause: error instanceof Error ? error.cause : undefined
    });
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.post('/api/upload/plan-files', memoryUpload.fields([
  { name: 'basic', maxCount: 10 },
  { name: 'standard', maxCount: 10 },
  { name: 'premium', maxCount: 10 },
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploaded: Record<string, string[]> = {};
    const { supabaseStorage } = await import('../server/supabase-storage');
    for (const tier of Object.keys(files)) {
      const tierFiles = files[tier] || [];
      uploaded[tier] = [];
      for (const f of tierFiles) {
        const filename = supabaseStorage.generateUniqueFilename(f.originalname);
        const result = await supabaseStorage.uploadPlanFile(f.buffer, filename, tier as any);
        uploaded[tier].push(result.publicUrl);
      }
    }
    res.json({ files: uploaded });
  } catch (error) {
    console.error('Upload plan files error:', error);
    res.status(500).json({ error: 'Failed to upload plan files' });
  }
});

// Gallery images upload endpoint
app.post('/api/upload/gallery', memoryUpload.array('gallery', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { supabaseStorage } = await import('../server/supabase-storage');
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filename = supabaseStorage.generateUniqueFilename(file.originalname);
      const result = await supabaseStorage.uploadGalleryImage(file.buffer, filename);
      uploadedUrls.push(result.publicUrl);
    }

    res.json({ 
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length
    });
  } catch (error) {
    console.error('Upload gallery error:', error);
    res.status(500).json({ error: 'Failed to upload gallery images' });
  }
});

app.post('/api/ads/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require', // Supabase requires SSL even in development
    });
    try {
      await client.unsafe(`UPDATE ads SET clicks = COALESCE(clicks, 0) + 1 WHERE id = $1`, [id]);
    } catch {}
    await client.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording ad click:', error);
    res.status(200).json({ success: true });
  }
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

// Plans CRUD endpoints for admin
app.post("/api/plans", async (req, res) => {
  try {
    const planData = req.body;
    console.log('Creating plan:', planData);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    const result = await client.unsafe(
      'INSERT INTO plans (title, description, category, price_basic, price_standard, price_premium, featured, status, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *',
      [planData.title, planData.description, planData.category, planData.price_basic, planData.price_standard, planData.price_premium, planData.featured || false, planData.status || 'active', planData.image_url]
    );
    await client.end();
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ 
      error: "Failed to create plan",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put("/api/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updating plan:', id, updates);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Build dynamic update query
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updates[field])];
    
    const result = await client.unsafe(
      `UPDATE plans SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    await client.end();
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ 
      error: "Failed to update plan",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete("/api/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting plan:', id);
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    const result = await client.unsafe('DELETE FROM plans WHERE id = $1 RETURNING *', [id]);
    await client.end();
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ 
      error: "Failed to delete plan",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Authentication endpoints
app.post("/api/auth/signin", async (req, res) => {
  try {
    console.log('Sign in endpoint hit');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { email, password } = req.body;
    
    console.log('Sign in attempt received:', { email, hasPassword: !!password });
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }
    
    console.log('Sign in attempt for email:', email);
    
    // For now, return a mock successful response
    // TODO: Implement actual authentication logic
    const response = {
      success: true,
      message: "Sign in successful",
      user: {
        id: "1",
        email: email,
        name: "Test User"
      },
      profile: {
        id: "1",
        user_id: "1",
        email: email,
        first_name: "Test",
        last_name: "User",
        role: "admin" // Set to admin for testing admin login
      }
    };
    
    console.log('Returning sign in response:', response);
    res.json(response);
  } catch (error) {
    console.error("Sign in error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ 
      error: "Sign in failed",
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    console.log('Sign up attempt received:', { email, firstName, lastName, hasPassword: !!password });
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }
    
    console.log('Sign up attempt for email:', email);
    
    // For now, return a mock successful response
    // TODO: Implement actual registration logic
      const response = {
        success: true,
        message: "Sign up successful",
        user: {
        id: "1",
        email: email,
        name: firstName ? `${firstName} ${lastName || ''}`.trim() : "New User"
        },
        profile: {
        id: "1",
        user_id: "1",
        email: email,
        first_name: firstName || null,
        last_name: lastName || null,
        role: "user"
      }
    };
    
    console.log('Returning sign up response:', response);
      res.json(response);
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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
      ssl: 'require', // Supabase requires SSL even in development
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


