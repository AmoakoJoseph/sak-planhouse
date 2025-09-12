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
    console.log('Fetching users from database...');
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock users');
      return res.json([
        {
          id: '1',
          user_id: '1',
          email: 'admin@sakconstructionsgh.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    // Connect to database and fetch real users
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    const users = await client.unsafe('SELECT * FROM profiles ORDER BY created_at DESC');
    await client.end();
    
    console.log(`Found ${users.length} users in database`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Portfolio API endpoints
app.get('/api/portfolio', async (req, res) => {
  try {
    console.log('Fetching portfolio from database...');
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning sample portfolio data');
      return res.json([
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
        }
      ]);
    }
    
    // Connect to database and fetch real portfolio data
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Try to fetch from portfolio table first, fallback to plans if portfolio doesn't exist
    let portfolioItems;
    try {
      portfolioItems = await client.unsafe('SELECT * FROM portfolio ORDER BY created_at DESC');
      console.log(`Found ${portfolioItems.length} portfolio items in portfolio table`);
    } catch (portfolioError) {
      console.log('Portfolio table not found, fetching from plans table');
      // Fallback to plans table if portfolio table doesn't exist
      const plans = await client.unsafe('SELECT * FROM plans WHERE status = $1 ORDER BY created_at DESC LIMIT 10', ['active']);
      portfolioItems = plans.map(plan => ({
        id: plan.id,
        title: plan.title,
        category: plan.category || 'Residential',
        summary: plan.description?.substring(0, 100) + '...' || 'Construction plan',
        description: plan.description || 'Professional construction plan',
        design_image: plan.image_url || '/placeholder.svg',
        current_image: plan.image_url || '/placeholder.svg',
        status: 'completed',
        created_at: plan.created_at
      }));
      console.log(`Converted ${portfolioItems.length} plans to portfolio items`);
    }
    
    await client.end();
    res.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching portfolio item with ID:', id);
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning sample portfolio item');
      return res.json({
        id: id,
        title: 'Sample Project',
        category: 'Residential',
        summary: 'Sample project description',
        description: 'This is a sample project for demonstration purposes.',
        design_image: '/placeholder.svg',
        current_image: '/placeholder.svg',
        status: 'completed',
        created_at: new Date().toISOString(),
        features: ['Sample feature 1', 'Sample feature 2'],
        specifications: { 'Area': '100 sqm', 'Completion': '2024' }
      });
    }
    
    // Connect to database and fetch real portfolio item
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Try to fetch from portfolio table first, fallback to plans if portfolio doesn't exist
    let item;
    try {
      const portfolioItems = await client.unsafe('SELECT * FROM portfolio WHERE id = $1', [id]);
      if (portfolioItems.length > 0) {
        item = portfolioItems[0];
        console.log('Found portfolio item in portfolio table');
      }
    } catch (portfolioError) {
      console.log('Portfolio table not found, checking plans table');
      // Fallback to plans table if portfolio table doesn't exist
      const plans = await client.unsafe('SELECT * FROM plans WHERE id = $1', [id]);
      if (plans.length > 0) {
        const plan = plans[0];
        item = {
          id: plan.id,
          title: plan.title,
          category: plan.category || 'Residential',
          summary: plan.description?.substring(0, 100) + '...' || 'Construction plan',
          description: plan.description || 'Professional construction plan',
          design_image: plan.image_url || '/placeholder.svg',
          current_image: plan.image_url || '/placeholder.svg',
          status: 'completed',
          created_at: plan.created_at,
          features: ['Professional design', 'Quality materials', 'Modern construction'],
          specifications: {
            'Category': plan.category || 'Residential',
            'Status': plan.status || 'Active',
            'Created': new Date(plan.created_at).getFullYear().toString()
          }
        };
        console.log('Converted plan to portfolio item');
      }
    }
    
    await client.end();
    
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
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning empty favorites');
      return res.json([]);
    }
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Try to fetch from favorites table first
    let favorites: any[] = [];
    try {
      favorites = await client.unsafe(`
        SELECT f.*, p.title, p.description, p.image_url, p.category
        FROM favorites f
        INNER JOIN plans p ON f.plan_id = p.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
      `, [userId]);
      console.log(`Found ${favorites.length} favorites in favorites table`);
    } catch (favoritesError) {
      console.log('Favorites table not found, using purchased plans as favorites');
      // Fallback: use purchased plans as favorites
      try {
        favorites = await client.unsafe(`
          SELECT DISTINCT p.*, o.created_at as favorited_at
          FROM plans p
          INNER JOIN orders o ON p.id = o.plan_id
          WHERE o.user_id = $1 AND o.status = 'completed'
          ORDER BY o.created_at DESC
        `, [userId]);
        console.log(`Found ${favorites.length} purchased plans as favorites`);
      } catch (ordersError) {
        console.log('Orders table not found, returning empty favorites');
        favorites = [];
      }
    }
    
    await client.end();
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// User analytics endpoint
app.get('/api/analytics/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching user analytics for user:', userId);
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock user analytics');
      return res.json({
        userId: userId,
        totalOrders: 0,
        totalSpent: 0,
        favoritePlans: [],
        recentActivity: [],
        accountCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    }
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Get user profile
    const profiles = await client.unsafe('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    if (profiles.length === 0) {
      await client.end();
      return res.status(404).json({ error: 'User not found' });
    }
    
    const profile = profiles[0];
    
    // Get user orders
    const orders = await client.unsafe('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    
    // Calculate total spent
    const totalSpent = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);
    
    // Get favorite plans (most ordered plans)
    const favoritePlans = await client.unsafe(`
      SELECT p.*, COUNT(o.id) as order_count
      FROM plans p
      INNER JOIN orders o ON p.id = o.plan_id
      WHERE o.user_id = $1 AND o.status = 'completed'
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 5
    `, [userId]);
    
    // Get recent activity (last 10 orders with plan details)
    const recentActivity = await client.unsafe(`
      SELECT o.*, p.title as plan_title
      FROM orders o
      LEFT JOIN plans p ON o.plan_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [userId]);
    
    await client.end();
    
    const userAnalytics = {
      userId: userId,
      totalOrders: orders.length,
      totalSpent: totalSpent,
      favoritePlans: favoritePlans,
      recentActivity: recentActivity,
      accountCreated: profile.created_at,
      lastLogin: profile.updated_at || profile.created_at
    };
    
    console.log('User analytics fetched successfully for user:', userId);
    res.json(userAnalytics);
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

// Ads API
app.get('/api/ads', async (req, res) => {
  try {
    const { is_active, position, type, target_page } = req.query as Record<string, string | undefined>;
    console.log('Fetching ads with filters:', { is_active, position, type, target_page });
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning empty ads array');
      return res.json([]);
    }

    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });

    // Try to fetch from ads table
    let ads: any[] = [];
    try {
      const filters: string[] = [];
      const params: any[] = [];
      if (is_active !== undefined) { filters.push(`is_active = $${params.length + 1}`); params.push(is_active === 'true'); }
      if (position) { filters.push(`position = $${params.length + 1}`); params.push(position); }
      if (type) { filters.push(`type = $${params.length + 1}`); params.push(type); }
      if (target_page) { filters.push(`(target_page = $${params.length + 1} OR target_page = 'all')`); params.push(target_page); }

      const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
      const query = `SELECT * FROM ads ${where} ORDER BY priority DESC, created_at DESC`;
      ads = await client.unsafe(query, params);
      console.log(`Found ${ads.length} ads in ads table`);
    } catch (adsError) {
      console.log('Ads table not found, returning empty array');
      ads = [];
    }
    
    await client.end();
    res.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Analytics API
app.get('/api/analytics', async (_req, res) => {
  try {
    console.log('Fetching analytics from database...');
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock analytics');
      return res.json({
        overview: {
          totalRevenue: 0,
          revenueGrowth: 0,
          totalOrders: 0,
          ordersGrowth: 0,
          totalUsers: 0,
          usersGrowth: 0,
          totalDownloads: 0,
          downloadsGrowth: 0
        },
        planMetrics: { basicSales: 0, standardSales: 0, premiumSales: 0, totalPlans: 0 },
        recentActivity: [],
        topPlans: []
      });
    }
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });

    // Fetch real analytics data
    const revenue = await client.unsafe(`SELECT COALESCE(SUM(amount),0)::decimal as total FROM orders WHERE status = 'completed'`);
    const users = await client.unsafe(`SELECT COUNT(*)::int as total FROM profiles`);
    const orders = await client.unsafe(`SELECT COUNT(*)::int as total FROM orders`);
    
    // Try to get downloads count (table might not exist)
    let downloads = [{ total: 0 }];
    try {
      downloads = await client.unsafe(`SELECT COUNT(*)::int as total FROM downloads`);
    } catch (downloadError) {
      console.log('Downloads table not found, using 0');
    }
    
    // Get plan metrics
    const planMetrics = await client.unsafe(`
      SELECT 
        tier,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as revenue
      FROM orders 
      WHERE status = 'completed' 
      GROUP BY tier
    `);
    
    // Get total plans count
    const totalPlans = await client.unsafe(`SELECT COUNT(*)::int as total FROM plans`);
    
    // Get recent activity (last 10 orders)
    const recentActivity = await client.unsafe(`
      SELECT o.*, p.title as plan_title, pr.email as user_email
      FROM orders o
      LEFT JOIN plans p ON o.plan_id = p.id
      LEFT JOIN profiles pr ON o.user_id = pr.user_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    
    // Get top plans by sales
    const topPlans = await client.unsafe(`
      SELECT p.*, COUNT(o.id) as sales_count, COALESCE(SUM(o.amount), 0) as revenue
      FROM plans p
      LEFT JOIN orders o ON p.id = o.plan_id AND o.status = 'completed'
      GROUP BY p.id
      ORDER BY sales_count DESC, revenue DESC
      LIMIT 5
    `);
    
    await client.end();
    
    // Process plan metrics
    const planMetricsData = {
      basicSales: 0,
      standardSales: 0,
      premiumSales: 0,
      totalPlans: Number(totalPlans[0]?.total || 0)
    };
    
    planMetrics.forEach(metric => {
      if (metric.tier === 'basic') planMetricsData.basicSales = Number(metric.count || 0);
      if (metric.tier === 'standard') planMetricsData.standardSales = Number(metric.count || 0);
      if (metric.tier === 'premium') planMetricsData.premiumSales = Number(metric.count || 0);
    });
    
    console.log('Analytics data fetched successfully');
      res.json({
      overview: {
        totalRevenue: Number(revenue[0]?.total || 0),
        revenueGrowth: 0, // TODO: Calculate growth from historical data
        totalOrders: Number(orders[0]?.total || 0),
        ordersGrowth: 0, // TODO: Calculate growth from historical data
        totalUsers: Number(users[0]?.total || 0),
        usersGrowth: 0, // TODO: Calculate growth from historical data
        totalDownloads: Number(downloads[0]?.total || 0),
        downloadsGrowth: 0 // TODO: Calculate growth from historical data
      },
      planMetrics: planMetricsData,
      recentActivity: recentActivity,
      topPlans: topPlans
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
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock response');
      return res.json({
        success: true,
        message: "Sign in successful (mock)",
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
          role: "admin"
        }
      });
    }
    
    // Connect to database and find user
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Find user profile by email
    const profiles = await client.unsafe('SELECT * FROM profiles WHERE email = $1', [email]);
    await client.end();
    
    if (profiles.length === 0) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const profile = profiles[0];
    console.log('Found user profile:', { id: profile.id, email: profile.email, role: profile.role });
    
    // For now, allow any existing user (in production, verify password hash)
    // TODO: Implement proper password verification with bcrypt
    const isValidUser = profile.email === 'admin@sakconstructionsgh.com' ? 
      password === 'admin123' : // Temporary admin check
      true; // Allow existing users for now
    
    if (!isValidUser) {
      console.log('Invalid credentials for user:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const response = {
      success: true,
      message: "Sign in successful",
      user: {
        id: profile.user_id,
        email: profile.email,
        name: profile.first_name && profile.last_name ? 
          `${profile.first_name} ${profile.last_name}` : 
          profile.email
      },
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role || 'user'
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
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock response');
      return res.json({
        success: true,
        message: "Sign up successful (mock)",
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
      });
    }
    
    // Connect to database
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Check if user already exists
    const existingProfiles = await client.unsafe('SELECT * FROM profiles WHERE email = $1', [email]);
    if (existingProfiles.length > 0) {
      await client.end();
      console.log('User already exists for email:', email);
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash password (in production, use bcrypt)
    // For now, we'll store a simple hash
    const hashedPassword = Buffer.from(password).toString('base64'); // Simple encoding for demo
    
    // Create user profile
    const result = await client.unsafe(
        'INSERT INTO profiles (user_id, email, first_name, last_name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [userId, email, firstName || null, lastName || null, 'user']
      );
    await client.end();
      
    const profile = result[0];
    console.log('Created user profile:', { id: profile.id, email: profile.email, role: profile.role });
      
      const response = {
        success: true,
        message: "Sign up successful",
        user: {
        id: profile.user_id,
          email: profile.email,
        name: profile.first_name && profile.last_name ? 
          `${profile.first_name} ${profile.last_name}` : 
          profile.email
        },
        profile: {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
        role: profile.role
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
    const { email, amount, planId, planTitle, packageType, userId } = req.body;
    console.log('Initializing payment:', { email, amount, planId, planTitle, packageType, userId });
    
    // Check if Paystack is configured
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.log('Paystack not configured, returning mock response');
      return res.json({
      success: true,
        message: "Payment initialized (mock)",
      reference: `ref_${Date.now()}`,
      authorization_url: "https://checkout.paystack.com/mock-checkout"
      });
    }
    
    // Generate unique reference
    const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert amount to kobo (multiply by 100)
    const amountInKobo = Math.round(amount * 100);
    
    // Prepare payment data
    const paymentData = {
      email,
      amount: amountInKobo,
      reference,
      callback_url: `${req.protocol}://${req.get('host')}/payment/verify`,
      planId,
      packageType,
      metadata: {
        planId,
        planTitle,
        packageType,
        userId: userId || null,
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: planTitle,
          },
          {
            display_name: "Package",
            variable_name: "package",
            value: packageType,
          },
        ],
      },
    };
    
    console.log('Payment data prepared:', paymentData);
    console.log('Making request to Paystack API...');
    
    // Call Paystack API
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: paymentData.email,
        amount: paymentData.amount,
        reference: paymentData.reference,
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata,
      }),
    });

    console.log('Paystack API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Paystack API error response:', errorText);
      throw new Error(`Paystack API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Paystack API response data:', responseData);

    if (!responseData.status) {
      throw new Error('Paystack API returned unsuccessful status');
    }

    res.json({
      success: true,
      authorization_url: responseData.data.authorization_url,
      access_code: responseData.data.access_code,
      reference: responseData.data.reference,
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ 
      error: "Failed to initialize payment",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Payment verification API
app.get("/api/payments/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    console.log('Verifying payment with reference:', reference);
    
    // Check if Paystack is configured
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.log('Paystack not configured, returning mock verification');
      return res.json({
        success: true,
        message: "Payment verified (mock)",
        order: {
          id: `order_${Date.now()}`,
          status: 'completed',
          amount: 1000,
          reference: reference
        }
      });
    }
    
    // Call Paystack verification API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Paystack verification response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Paystack verification error response:', errorText);
      throw new Error(`Paystack verification error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Paystack verification response data:', responseData);

    if (!responseData.status || responseData.data.status !== 'success') {
      throw new Error('Payment verification failed or payment not successful');
    }

    // Create order in database
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });

    const orderData = responseData.data;
    const metadata = orderData.metadata || {};
    
    const result = await client.unsafe(
      'INSERT INTO orders (user_id, plan_id, tier, amount, status, payment_intent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [metadata.userId || null, metadata.planId, metadata.packageType, orderData.amount / 100, 'completed', reference]
    );
    await client.end();

    res.json({
      success: true,
      message: "Payment verified successfully",
      order: result[0]
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      error: "Failed to verify payment",
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reviews API endpoints
app.get('/api/reviews/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    console.log('Fetching reviews for plan:', planId);
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning empty reviews');
      return res.json([]);
    }
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Try to fetch from reviews table
    let reviews: any[] = [];
    try {
      reviews = await client.unsafe(`
        SELECT r.*, p.email as user_email, p.first_name, p.last_name
        FROM reviews r
        LEFT JOIN profiles p ON r.user_id = p.user_id
        WHERE r.plan_id = $1
        ORDER BY r.created_at DESC
      `, [planId]);
      console.log(`Found ${reviews.length} reviews for plan ${planId}`);
    } catch (reviewsError) {
      console.log('Reviews table not found, returning empty reviews');
      reviews = [];
    }
    
    await client.end();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { plan_id, user_id, rating, title, content } = req.body;
    console.log('Creating review:', { plan_id, user_id, rating, title });
    
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.log('Database not configured, returning mock review');
      return res.json({
        id: Date.now(),
        plan_id,
        user_id,
        rating,
        title,
        content,
        created_at: new Date().toISOString()
      });
    }
    
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require',
    });
    
    // Try to create review in reviews table
    try {
      const result = await client.unsafe(`
        INSERT INTO reviews (plan_id, user_id, rating, title, content, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `, [plan_id, user_id, rating, title, content]);
      
      await client.end();
      console.log('Review created successfully');
      res.json(result[0]);
    } catch (reviewsError) {
      console.log('Reviews table not found, returning mock review');
      await client.end();
      res.json({
        id: Date.now(),
        plan_id,
        user_id,
        rating,
        title,
        content,
        created_at: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
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


