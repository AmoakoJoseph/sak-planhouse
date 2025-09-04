const { Pool } = require('pg');
const crypto = require('crypto');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to get profile by email
async function getProfileByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting profile by email:', error);
    return null;
  }
}

// Helper function to create profile
async function createProfile(profileData) {
  try {
    const result = await pool.query(
      `INSERT INTO profiles (
        user_id, email, first_name, last_name, phone, role, 
        avatar_url, address, city, country, bio, company, website
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *`,
      [
        profileData.user_id, profileData.email, profileData.first_name,
        profileData.last_name, profileData.phone, profileData.role,
        profileData.avatar_url, profileData.address, profileData.city,
        profileData.country, profileData.bio, profileData.company, profileData.website
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

// Helper function to create order
async function createOrder(orderData) {
  try {
    const result = await pool.query(
      `INSERT INTO orders (
        user_id, plan_id, tier, amount, payment_intent_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        orderData.user_id, orderData.plan_id, orderData.tier,
        orderData.amount, orderData.payment_intent_id, orderData.status
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Helper function to get plans
async function getPlans(filters = {}) {
  try {
    let query = 'SELECT * FROM plans WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.featured !== undefined) {
      query += ` AND featured = $${paramCount}`;
      params.push(filters.featured);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting plans:', error);
    throw error;
  }
}

// Helper function to get plan by ID
async function getPlanById(id) {
  try {
    const result = await pool.query(
      'SELECT * FROM plans WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting plan by ID:', error);
    return null;
  }
}

// Helper function to get orders
async function getOrders(userId) {
  try {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    
    if (userId) {
      query += ' AND user_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
}

// Helper function to get order by ID
async function getOrder(orderId) {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
}

// Helper function to get profile by user ID
async function getProfile(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting profile by user ID:', error);
    return null;
  }
}

// Helper function to update profile
async function updateProfile(userId, updates) {
  try {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(updates);
    
    const query = `UPDATE profiles SET ${fields}, updated_at = NOW() WHERE user_id = $1 RETURNING *`;
    const result = await pool.query(query, [userId, ...values]);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Helper function to get all users
async function getAllUsers() {
  try {
    const result = await pool.query('SELECT * FROM profiles ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

// Helper function to get analytics
async function getAnalytics() {
  try {
    const ordersResult = await pool.query('SELECT COUNT(*) as total_orders, SUM(CAST(amount AS DECIMAL)) as total_revenue FROM orders WHERE status = \'completed\'');
    const usersResult = await pool.query('SELECT COUNT(*) as total_users FROM profiles');
    const plansResult = await pool.query('SELECT COUNT(*) as total_plans FROM plans WHERE status = \'active\'');
    
    return {
      totalOrders: parseInt(ordersResult.rows[0]?.total_orders || '0'),
      totalRevenue: parseFloat(ordersResult.rows[0]?.total_revenue || '0'),
      totalUsers: parseInt(usersResult.rows[0]?.total_users || '0'),
      totalPlans: parseInt(plansResult.rows[0]?.total_plans || '0')
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
}

// Helper function to get user analytics
async function getUserAnalytics(userId) {
  try {
    const userOrders = await getOrders(userId);
    const userDownloads = await getDownloads(userId);
    
    return {
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0),
      totalDownloads: userDownloads.length,
      recentOrders: userOrders.slice(0, 5),
      recentDownloads: userDownloads.slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
}

// Helper function to get downloads
async function getDownloads(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM downloads WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting downloads:', error);
    return [];
  }
}

// Helper function to record download
async function recordDownload(downloadData) {
  try {
    const result = await pool.query(
      `INSERT INTO downloads (order_id, plan_id, user_id, created_at, download_count) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        downloadData.order_id,
        downloadData.plan_id,
        downloadData.user_id,
        downloadData.created_at,
        downloadData.download_count
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
}

// Main API handler
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const { path, httpMethod, body } = event;
  const pathSegments = path.split('/').filter(Boolean);

  try {
    // API routes
    if (pathSegments[0] === 'api') {
      const route = pathSegments[1];
      const subRoute = pathSegments[2];

      // GET /api/plans
      if (route === 'plans' && httpMethod === 'GET') {
        const queryParams = event.queryStringParameters || {};
        const filters = {};
        
        if (queryParams.status) filters.status = queryParams.status;
        if (queryParams.featured !== undefined) filters.featured = queryParams.featured === 'true';

        const plans = await getPlans(filters);
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(plans)
        };
      }

      // GET /api/plans/:id
      if (route === 'plans' && subRoute && httpMethod === 'GET') {
        const plan = await getPlanById(subRoute);
        if (!plan) {
          return {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Plan not found' })
          };
        }
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(plan)
        };
      }

      // POST /api/payments/initialize
      if (route === 'payments' && subRoute === 'initialize' && httpMethod === 'POST') {
        const { email, amount, planId, planTitle, packageType, userId } = JSON.parse(body);
        
        console.log('Payment initialization request:', { email, amount, planId, planTitle, packageType, userId });

        if (!email || !amount || !planId || !planTitle || !packageType) {
          return {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }

        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackSecretKey) {
          console.error('PAYSTACK_SECRET_KEY not set');
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Payment service not configured' })
          };
        }

        try {
          const paymentData = {
            email,
            amount: Math.round(amount * 100), // Convert to kobo
            reference: `ref_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
            callback_url: `${process.env.URL}/payment/verify`,
            metadata: {
              planId,
              planTitle,
              packageType,
              userId: userId || null,
              custom_fields: [
                { display_name: 'Plan ID', variable_name: 'plan_id', value: planId },
                { display_name: 'Package Type', variable_name: 'package_type', value: packageType }
              ]
            }
          };

          const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
          });

          const result = await response.json();

          if (result.status) {
            return {
              statusCode: 200,
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                authorization_url: result.data.authorization_url,
                reference: result.data.reference,
                access_code: result.data.access_code
              })
            };
          } else {
            return {
              statusCode: 400,
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({ error: result.message || 'Payment initialization failed' })
            };
          }
        } catch (error) {
          console.error('Paystack API error:', error);
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to initialize payment' })
          };
        }
      }

      // GET /api/payments/verify/:reference
      if (route === 'payments' && subRoute === 'verify' && pathSegments[3] && httpMethod === 'GET') {
        const reference = pathSegments[3];
        
        console.log('Verifying payment with reference:', reference);

        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackSecretKey) {
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Payment service not configured' })
          };
        }

        try {
          const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`
            }
          });

          const verification = await response.json();

          if (verification.data.status === 'success') {
            console.log('Payment successful, creating order...');
            console.log('Verification metadata:', verification.data.metadata);
            
            let orderUserId = verification.data.metadata?.userId;
            
            if (!orderUserId) {
              console.log('No user ID in metadata, checking if user exists by email...');
              const userEmail = verification.data.customer?.email;
              if (userEmail) {
                const existingProfile = await getProfileByEmail(userEmail);
                if (existingProfile) {
                  orderUserId = existingProfile.user_id;
                  console.log('Found existing user by email:', orderUserId);
                } else {
                  console.log('No existing user found, creating new user profile...');
                  orderUserId = crypto.randomUUID();
                  const profileData = {
                    user_id: orderUserId,
                    email: userEmail,
                    first_name: null,
                    last_name: null,
                    phone: null,
                    role: 'user',
                    avatar_url: null,
                    address: null,
                    city: null,
                    country: 'Ghana',
                    bio: null,
                    company: null,
                    website: null
                  };
                  await createProfile(profileData);
                  console.log('Created new user profile:', orderUserId);
                }
              } else {
                console.log('No email found in Paystack response, creating guest user...');
                orderUserId = crypto.randomUUID();
              }
            }

            console.log('Final user ID for order:', orderUserId);
            
            const orderData = {
              user_id: orderUserId,
              plan_id: verification.data.metadata.planId,
              tier: verification.data.metadata.packageType,
              amount: String(verification.data.amount / 100),
              payment_intent_id: reference,
              status: 'completed',
            };

            const order = await createOrder(orderData);
            console.log('Order created successfully:', order);

            return {
              statusCode: 200,
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                success: true,
                order: order,
                message: 'Payment verified and order created successfully'
              })
            };
          } else {
            return {
              statusCode: 400,
              headers: { ...headers, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                success: false,
                message: 'Payment verification failed',
                status: verification.data.status
              })
            };
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to verify payment' })
          };
        }
      }

             // GET /api/downloads/:orderId
       if (route === 'downloads' && subRoute && httpMethod === 'GET') {
         const orderId = subRoute;
         
         try {
           const order = await getOrder(orderId);
           if (!order) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Order not found' })
             };
           }

           if (order.status !== 'completed') {
             return {
               statusCode: 403,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Payment not completed' })
             };
           }

           const plan = await getPlanById(order.plan_id);
           if (!plan) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Plan not found' })
             };
           }

           // Get files based on tier hierarchy
           let availableFiles = [];
           const planFiles = plan.plan_files || {};
           
           if (order.tier === 'basic') {
             availableFiles = planFiles.basic || [];
           } else if (order.tier === 'standard') {
             availableFiles = [
               ...(planFiles.basic || []),
               ...(planFiles.standard || [])
             ];
           } else if (order.tier === 'premium') {
             availableFiles = [
               ...(planFiles.basic || []),
               ...(planFiles.standard || []),
               ...(planFiles.premium || [])
             ];
           }
           
           if (!availableFiles || availableFiles.length === 0) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'No files available for download' })
             };
           }

           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({
               orderId,
               planTitle: plan.title,
               packageType: order.tier,
               files: availableFiles,
               expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
             })
           };
         } catch (error) {
           console.error('Error getting download info:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to get download information' })
           };
         }
       }

       // GET /api/downloads/:orderId/file
       if (route === 'downloads' && subRoute && httpMethod === 'GET' && pathSegments[3] === 'file') {
         const orderId = subRoute;
         const filePath = event.queryStringParameters?.filePath;
         
         if (!filePath) {
           return {
             statusCode: 400,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'File path is required' })
           };
         }

         try {
           const order = await getOrder(orderId);
           if (!order) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Order not found' })
             };
           }

           if (order.status !== 'completed') {
             return {
               statusCode: 403,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Payment not completed' })
             };
           }

           const plan = await getPlanById(order.plan_id);
           if (!plan) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Plan not found' })
             };
           }

           // Get files based on tier hierarchy and verify access
           let availableFiles = [];
           const planFiles = plan.plan_files || {};
           
           if (order.tier === 'basic') {
             availableFiles = planFiles.basic || [];
           } else if (order.tier === 'standard') {
             availableFiles = [
               ...(planFiles.basic || []),
               ...(planFiles.standard || [])
             ];
           } else if (order.tier === 'premium') {
             availableFiles = [
               ...(planFiles.basic || []),
               ...(planFiles.standard || []),
               ...(planFiles.premium || [])
             ];
           }

           if (!availableFiles.includes(filePath)) {
             return {
               statusCode: 403,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'File not included in your package' })
             };
           }

           // Record the download
           await recordDownload({
             order_id: orderId,
             plan_id: order.plan_id,
             user_id: order.user_id,
             created_at: new Date(),
             download_count: 1,
           });

           // For Netlify Functions, we can't serve files directly
           // Instead, return the file path for the frontend to handle
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({
               filePath: filePath,
               fileName: filePath.split('/').pop(),
               message: 'File access granted. Frontend should handle the actual file download.'
             })
           };
         } catch (error) {
           console.error('Error accessing file:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to access file' })
           };
         }
       }

       // GET /api/orders
       if (route === 'orders' && httpMethod === 'GET') {
         try {
           const { userId } = event.queryStringParameters || {};
           const orders = await getOrders(userId);
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(orders)
           };
         } catch (error) {
           console.error('Error fetching orders:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to fetch orders' })
           };
         }
       }

       // POST /api/orders
       if (route === 'orders' && httpMethod === 'POST') {
         try {
           const orderData = JSON.parse(body);
           const order = await createOrder(orderData);
           return {
             statusCode: 201,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(order)
           };
         } catch (error) {
           console.error('Error creating order:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to create order' })
           };
         }
       }

       // GET /api/profiles/:userId
       if (route === 'profiles' && subRoute && httpMethod === 'GET') {
         try {
           const profile = await getProfile(subRoute);
           if (!profile) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Profile not found' })
             };
           }
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(profile)
           };
         } catch (error) {
           console.error('Error fetching profile:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to fetch profile' })
           };
         }
       }

       // POST /api/profiles
       if (route === 'profiles' && httpMethod === 'POST') {
         try {
           const profileData = JSON.parse(body);
           const profile = await createProfile(profileData);
           return {
             statusCode: 201,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(profile)
           };
         } catch (error) {
           console.error('Error creating profile:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to create profile' })
           };
         }
       }

       // PUT /api/profiles/:userId
       if (route === 'profiles' && subRoute && httpMethod === 'PUT') {
         try {
           const updates = JSON.parse(body);
           const profile = await updateProfile(subRoute, updates);
           if (!profile) {
             return {
               statusCode: 404,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Profile not found' })
             };
           }
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(profile)
           };
         } catch (error) {
           console.error('Error updating profile:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to update profile' })
           };
         }
       }

       // GET /api/analytics
       if (route === 'analytics' && httpMethod === 'GET') {
         try {
           const analytics = await getAnalytics();
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(analytics)
           };
         } catch (error) {
           console.error('Error fetching analytics:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to fetch analytics' })
           };
         }
       }

       // GET /api/analytics/user/:userId
       if (route === 'analytics' && subRoute === 'user' && pathSegments[3] && httpMethod === 'GET') {
         try {
           const userId = pathSegments[3];
           const analytics = await getUserAnalytics(userId);
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(analytics)
           };
         } catch (error) {
           console.error('Error fetching user analytics:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to fetch user analytics' })
           };
         }
       }

       // GET /api/users
       if (route === 'users' && httpMethod === 'GET') {
         try {
           const users = await getAllUsers();
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify(users)
           };
         } catch (error) {
           console.error('Error fetching users:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to fetch users' })
           };
         }
       }

       // POST /api/auth/signin
       if (route === 'auth' && subRoute === 'signin' && httpMethod === 'POST') {
         try {
           const { email, password } = JSON.parse(body);
           
           // For the admin user, check credentials
           if (email === 'admin@sakconstructionsgh.com' && password === 'admin123') {
             const profile = await getProfileByEmail(email);
             if (profile) {
               return {
                 statusCode: 200,
                 headers: { ...headers, 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   user: { id: profile.user_id, email: profile.email },
                   profile
                 })
               };
             }
           }
           
           // For regular users, check if they exist in the database
           const profile = await getProfileByEmail(email);
           if (profile) {
             // In production, you'd verify the password hash here
             // For now, we'll allow any user with a valid email to sign in
             return {
               statusCode: 200,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 user: { id: profile.user_id, email: profile.email },
                 profile
               })
             };
           }
           
           return {
             statusCode: 401,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Invalid credentials' })
           };
         } catch (error) {
           console.error('Error signing in:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to sign in' })
           };
         }
       }

       // POST /api/auth/signup
       if (route === 'auth' && subRoute === 'signup' && httpMethod === 'POST') {
         try {
           const { email, password, firstName, lastName } = JSON.parse(body);
           
           // Validate required fields
           if (!email || !password) {
             return {
               statusCode: 400,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Email and password are required' })
             };
           }
           
           // Check if user already exists
           const existingProfile = await getProfileByEmail(email);
           if (existingProfile) {
             return {
               statusCode: 409,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'User with this email already exists' })
             };
           }
           
           // Create new user and profile
           const userId = crypto.randomUUID();
           
           const profileData = {
             user_id: userId,
             email,
             first_name: firstName || null,
             last_name: lastName || null,
             phone: null,
             role: 'user',
             avatar_url: null,
             address: null,
             city: null,
             country: 'Ghana',
             bio: null,
             company: null,
             website: null
           };
           
           const profile = await createProfile(profileData);
           
           if (profile) {
             return {
               statusCode: 201,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 user: { id: userId, email },
                 profile
               })
             };
           } else {
             return {
               statusCode: 500,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Failed to create user profile' })
             };
           }
         } catch (error) {
           console.error('Error signing up:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to sign up' })
           };
         }
       }

       // POST /api/auth/signout
       if (route === 'auth' && subRoute === 'signout' && httpMethod === 'POST') {
         return {
           statusCode: 200,
           headers: { ...headers, 'Content-Type': 'application/json' },
           body: JSON.stringify({ success: true })
         };
       }

       // POST /api/contact/send-email
       if (route === 'contact' && subRoute === 'send-email' && httpMethod === 'POST') {
         try {
           const { to, subject, name, email, phone, planType, message } = JSON.parse(body);
           
           // Validate required fields
           if (!name || !email || !message) {
             return {
               statusCode: 400,
               headers: { ...headers, 'Content-Type': 'application/json' },
               body: JSON.stringify({ error: 'Name, email, and message are required' })
             };
           }
           
           // For now, we'll simulate sending the email
           // In production, you would integrate with a real email service
           console.log('Contact form submission:', {
             to,
             subject,
             name,
             email,
             phone,
             planType,
             message,
             timestamp: new Date().toISOString()
           });
           
           // Simulate email sending delay
           await new Promise(resolve => setTimeout(resolve, 1000));
           
           return {
             statusCode: 200,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
               success: true, 
               message: 'Email sent successfully',
               timestamp: new Date().toISOString()
             })
           };
         } catch (error) {
           console.error('Error sending contact email:', error);
           return {
             statusCode: 500,
             headers: { ...headers, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Failed to send email' })
           };
         }
       }

      // Default API response
      return {
        statusCode: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'API endpoint not found' })
      };
    }

    // Default response for non-API routes
    return {
      statusCode: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('API error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
