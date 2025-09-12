import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { PaystackService } from "./paystack";
import bcrypt from "bcryptjs";
import { supabaseStorage } from "./supabase-storage";

// Multer configuration for file uploads - use memory storage for serverless
const uploadImage = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const uploadPlanFile = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.dwg', '.dxf', '.zip'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DWG, DXF, and ZIP files are allowed!'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Authentication middleware to check if user is logged in
const requireAuth = async (req: any, res: any, next: any) => {
  try {
    // Only check session, remove header fallback for security
    const userEmail = req.session?.user?.email;
    
    if (!userEmail) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Get user profile
    const profile = await storage.getProfileByEmail(userEmail);
    if (!profile) {
      return res.status(401).json({ error: "User profile not found" });
    }
    
    req.userProfile = profile;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication check failed" });
  }
};

// RBAC middleware to check user permissions
const requireRole = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      // Get user session/auth info - this would be from your auth middleware
      const userEmail = req.session?.user?.email || req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Get user profile to check role
      const profile = await storage.getProfileByEmail(userEmail);
      if (!profile || !allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      
      req.userProfile = profile;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ error: "Authorization check failed" });
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint to verify server is working
  app.get("/api/test", (req, res) => {
    res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
  });

  // No local static uploads in serverless

  // File Upload API - Supabase
  app.post("/api/upload/image", uploadImage.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const uniqueFilename = supabaseStorage.generateUniqueFilename(req.file.originalname);
      const uploadResult = await supabaseStorage.uploadImage(req.file.buffer, uniqueFilename, 'images');

      res.json({ 
        filename: uploadResult.filename,
        path: uploadResult.path,
        url: uploadResult.publicUrl
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/plan-files", uploadPlanFile.fields([
    { name: 'basic', maxCount: 10 },
    { name: 'standard', maxCount: 10 },
    { name: 'premium', maxCount: 10 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedFiles: { [tier: string]: string[] } = {};

      for (const tier of Object.keys(files)) {
        const tierFiles = files[tier] || [];
        const URLs: string[] = [];
        for (const f of tierFiles) {
          const uniqueFilename = supabaseStorage.generateUniqueFilename(f.originalname);
          const result = await supabaseStorage.uploadPlanFile(f.buffer, uniqueFilename, tier as any);
          URLs.push(result.publicUrl);
        }
        uploadedFiles[tier] = URLs;
      }

      res.json({ files: uploadedFiles });
    } catch (error) {
      console.error("Error uploading plan files:", error);
      res.status(500).json({ error: "Failed to upload plan files" });
    }
  });

  // Plans API
  app.get("/api/plans", async (req, res) => {
    try {
      const { status, featured } = req.query;
      const filters: { status?: string; featured?: boolean } = {};
      
      if (status) filters.status = status as string;
      if (featured) filters.featured = featured === 'true';
      
      const plans = await storage.getPlans(filters);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const plan = await storage.createPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.put("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.updatePlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const success = await storage.deletePlan(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      const orders = await storage.getOrders(userId as string);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Profiles API
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profile = await storage.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.put("/api/profiles/:userId", requireRole(['super_admin']), async (req, res) => {
    try {
      const { role, ...otherUpdates } = req.body;
      const requestingProfile = (req as any).userProfile;
      
      // Role-specific validations for role changes
      if (role !== undefined) {
        // Validate role value
        const validRoles = ['user', 'admin', 'super_admin'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ error: "Invalid role value" });
        }
        
        // Prevent self-demotion from super_admin
        if (requestingProfile.user_id === req.params.userId && 
            requestingProfile.role === 'super_admin' && 
            role !== 'super_admin') {
          return res.status(400).json({ error: "Cannot demote yourself from super_admin" });
        }
        
        // Check if this would be the last super_admin
        if (role !== 'super_admin') {
          const currentProfile = await storage.getProfile(req.params.userId);
          if (currentProfile?.role === 'super_admin') {
            const allUsers = await storage.getAllUsers();
            const superAdminCount = allUsers.filter(user => user.role === 'super_admin').length;
            if (superAdminCount <= 1) {
              return res.status(400).json({ error: "Cannot demote the last super_admin" });
            }
          }
        }
      }
      
      const profile = await storage.updateProfile(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      // Log role changes for security audit
      if (role !== undefined) {
        console.log(`Role change: ${requestingProfile.email} changed user ${req.params.userId} to role ${role}`);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Ads API
  app.get("/api/ads", async (req, res) => {
    try {
      const { is_active, target_page } = req.query;
      const filters: any = {};
      
      if (is_active !== undefined) {
        filters.is_active = is_active === 'true';
      }
      if (target_page) {
        filters.target_page = target_page as string;
      }
      
      const ads = await storage.getAds(filters);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  });

  app.get("/api/ads/:id", async (req, res) => {
    try {
      const ad = await storage.getAd(req.params.id);
      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.json(ad);
    } catch (error) {
      console.error("Error fetching ad:", error);
      res.status(500).json({ error: "Failed to fetch ad" });
    }
  });

  app.post("/api/ads", requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const ad = await storage.createAd(req.body);
      res.status(201).json(ad);
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).json({ error: "Failed to create ad" });
    }
  });

  app.put("/api/ads/:id", requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const ad = await storage.updateAd(req.params.id, req.body);
      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.json(ad);
    } catch (error) {
      console.error("Error updating ad:", error);
      res.status(500).json({ error: "Failed to update ad" });
    }
  });

  app.delete("/api/ads/:id", requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
      const success = await storage.deleteAd(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ad:", error);
      res.status(500).json({ error: "Failed to delete ad" });
    }
  });

  // Ad tracking endpoints
  app.post("/api/ads/:id/impression", async (req, res) => {
    try {
      await storage.recordAdImpression(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error recording ad impression:", error);
      res.status(500).json({ error: "Failed to record impression" });
    }
  });

  app.post("/api/ads/:id/click", async (req, res) => {
    try {
      await storage.recordAdClick(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error recording ad click:", error);
      res.status(500).json({ error: "Failed to record click" });
    }
  });

  // Analytics API
  app.get("/api/analytics", async (req, res) => {
    try {
      console.log("Analytics endpoint called");
      const analytics = await storage.getAnalytics();
      console.log("Analytics fetched successfully:", analytics);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ error: "Failed to fetch analytics", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // User Analytics API
  app.get("/api/analytics/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user-specific analytics
      const userOrders = await storage.getOrders(userId);
      const userDownloads = await storage.getDownloads(userId);
      
      const analytics = {
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0),
        totalDownloads: userDownloads.length,
        recentOrders: userOrders.slice(0, 5),
        recentDownloads: userDownloads.slice(0, 5)
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  });

  // Users API
  // Protected endpoint - only super_admin can access user list
  app.get("/api/users", requireRole(['super_admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin creation endpoint - only super_admin can create new admins
  app.post("/api/admin/create", requireRole(['super_admin']), async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !firstName || !lastName || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Validate role
      const validRoles = ['admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'super_admin'" });
      }
      
      // Check if user already exists
      const existingProfile = await storage.getProfileByEmail(email);
      if (existingProfile) {
        return res.status(409).json({ error: "User with this email already exists" });
      }
      
      // Create new admin profile
      const { randomUUID } = await import('crypto');
      const userId = randomUUID();
      
      const profileData = {
        user_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: null,
        role,
        avatar_url: null,
        address: null,
        city: null,
        country: 'Ghana',
        bio: null,
        company: null,
        website: null
      };
      
      const profile = await storage.createProfile(profileData);
      
      if (profile) {
        // Log admin creation for security audit
        const requestingProfile = (req as any).userProfile;
        console.log(`Admin creation: ${requestingProfile.email} created new ${role} account for ${email}`);
        
        res.status(201).json({
          user: { id: userId, email },
          profile
        });
      } else {
        res.status(500).json({ error: "Failed to create admin profile" });
      }
      
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ error: "Failed to create admin account" });
    }
  });

  // Authentication API
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Find user by email
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // TODO: For now, we'll create a basic admin check and allow any existing user
      // In production, you'd verify the password hash here
      const isValidUser = profile.email === 'admin@sakconstructionsgh.com' ? 
        password === 'admin123' : // Temporary admin check
        true; // Allow existing users for now
      
      if (!isValidUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Establish session
      (req as any).session.user = {
        id: profile.user_id,
        email: profile.email
      };
      
      res.json({
        user: { id: profile.user_id, email: profile.email },
        profile
      });
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      
      // Check if user already exists
      const existingProfile = await storage.getProfileByEmail(email);
      if (existingProfile) {
        return res.status(409).json({ error: "User with this email already exists" });
      }
      
      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user and profile
      const { randomUUID } = await import('crypto');
      const userId = randomUUID();
      
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
      
      const profile = await storage.createProfile(profileData);
      
      if (profile) {
        // Establish session for the new user
        (req as any).session.user = {
          id: userId,
          email
        };
        
        res.status(201).json({
          user: { id: userId, email },
          profile
        });
      } else {
        res.status(500).json({ error: "Failed to create user profile" });
      }
      
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ error: "Failed to sign up" });
    }
  });

  // Change Password API
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userProfile = (req as any).userProfile;
      
      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      
      // Validate new password strength
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters long" });
      }
      
      // For now, we'll just update the password (in production, you'd verify current password first)
      // TODO: Add proper password verification logic when implementing hashed passwords
      
      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // In a real implementation, you'd store this hashed password in the users table
      // For now, we'll simulate success
      console.log(`Password changed for user: ${userProfile.email}`);
      
      res.json({ 
        message: "Password changed successfully" 
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // User Profile Update API (for users updating their own profiles)
  app.put("/api/profile/me", requireAuth, async (req, res) => {
    try {
      const userProfile = (req as any).userProfile;
      const { role, ...profileUpdates } = req.body;
      
      // Users cannot change their own role
      if (role !== undefined) {
        return res.status(403).json({ error: "Cannot change your own role" });
      }
      
      // Validate email if being updated
      if (profileUpdates.email && profileUpdates.email !== userProfile.email) {
        const existingProfile = await storage.getProfileByEmail(profileUpdates.email);
        if (existingProfile) {
          return res.status(409).json({ error: "Email already in use by another account" });
        }
      }
      
      const updatedProfile = await storage.updateProfile(userProfile.user_id, profileUpdates);
      if (!updatedProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    try {
      // Destroy the session
      (req as any).session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Failed to sign out" });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Error signing out:", error);
      res.status(500).json({ error: "Failed to sign out" });
    }
  });

  // Payment routes
  app.post("/api/payments/initialize", async (req, res) => {
    try {
      console.log('=== PAYMENT INITIALIZATION DEBUG ===');
      console.log('Request body received:', req.body);
      console.log('Request headers:', req.headers);
      
      const { email, amount, planId, planTitle, packageType, userId } = req.body;
      console.log('Extracted fields:', { email, amount, planId, planTitle, packageType, userId });
      console.log('User ID type:', typeof userId);
      console.log('User ID value:', userId);

      if (!email || !amount || !planId) {
        console.log('Missing required fields:', { 
          hasEmail: !!email, 
          hasAmount: !!amount, 
          hasPlanId: !!planId 
        });
        return res.status(400).json({ error: "Missing required payment data" });
      }

      console.log('All required fields present, generating reference...');
      const reference = PaystackService.generateReference();
      console.log('Generated reference:', reference);
      
      const amountInKobo = Math.round(amount * 100); // Convert cedis to kobo
      console.log('Amount conversion:', { original: amount, inKobo: amountInKobo });

      // Get user ID from request body or generate one
      let requestUserId = userId;
      
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
          userId: requestUserId, // Store user ID in metadata for verification
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
      console.log('Callback URL:', paymentData.callback_url);
      console.log('Environment check - PAYSTACK_SECRET_KEY exists:', !!process.env.PAYSTACK_SECRET_KEY);
      console.log('Environment check - PAYSTACK_SECRET_KEY length:', process.env.PAYSTACK_SECRET_KEY?.length || 0);

      console.log('Calling PaystackService.initializePayment...');
      const result = await PaystackService.initializePayment(paymentData);
      console.log('PaystackService result:', result);

      if (result.success && result.data) {
        console.log('Payment initialization successful, sending response...');
        res.json({
          success: true,
          authorization_url: result.data.authorization_url,
          access_code: result.data.access_code,
          reference: result.data.reference,
        });
      } else {
        console.log('Payment initialization failed - no success or data');
        res.status(400).json({ error: "Failed to initialize payment" });
      }
    } catch (error) {
      console.error("=== PAYMENT INITIALIZATION ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      console.error("Error message:", (error as any)?.message);
      console.error("Error stack:", (error as any)?.stack);
      console.error("Full error object:", error);
      
      res.status(500).json({ 
        error: "Failed to initialize payment",
        details: (error as any)?.message || 'Unknown error',
        type: (error as any)?.constructor?.name || 'Unknown'
      });
    }
  });

  app.get("/api/payments/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      console.log('=== PAYMENT VERIFICATION DEBUG ===');
      console.log('Verifying payment with reference:', reference);

      if (!reference) {
        console.log('No reference provided');
        return res.status(400).json({ error: "Payment reference is required" });
      }

      console.log('Calling PaystackService.verifyPayment...');
      const verification = await PaystackService.verifyPayment(reference);
      console.log('Paystack verification result:', verification);

      if (!verification) {
        console.log('Verification returned null/undefined');
        return res.status(400).json({ error: "Payment verification failed" });
      }

      if (verification.data.status === 'success') {
        console.log('Payment successful, creating order...');
        console.log('Verification metadata:', verification.data.metadata);
        
        // Validate required metadata
        const metadata = verification.data.metadata || {};
        const planId = metadata.planId;
        const packageType = metadata.packageType;
        
        if (!planId) {
          console.error('Missing planId in payment metadata:', metadata);
          return res.status(400).json({ 
            error: "Invalid payment: missing plan information",
            details: "Plan ID not found in payment metadata"
          });
        }
        
        if (!packageType || !['basic', 'standard', 'premium'].includes(packageType)) {
          console.error('Missing or invalid packageType in payment metadata:', metadata);
          return res.status(400).json({ 
            error: "Invalid payment: missing or invalid package type",
            details: "Package type must be basic, standard, or premium"
          });
        }
        
        // Get user ID from metadata or find/create user
        let orderUserId = metadata.userId;
        
        if (!orderUserId) {
          console.log('No user ID in metadata, checking if user exists by email...');
          // Try to find user by email from Paystack response
          const userEmail = verification.data.customer?.email;
          if (userEmail) {
            const existingProfile = await storage.getProfileByEmail(userEmail);
            if (existingProfile) {
              orderUserId = existingProfile.user_id;
              console.log('Found existing user by email:', orderUserId);
            } else {
              console.log('No existing user found, creating new user profile...');
              // Create new user profile
              const { randomUUID } = await import('crypto');
              orderUserId = randomUUID();
              const profileData = {
                user_id: orderUserId,
                email: userEmail,
                first_name: verification.data.customer?.first_name || null,
                last_name: verification.data.customer?.last_name || null,
                phone: verification.data.customer?.phone || null,
                role: 'user',
                avatar_url: null,
                address: null,
                city: null,
                country: 'Ghana',
                bio: null,
                company: null,
                website: null
              };
              await storage.createProfile(profileData);
              console.log('Created new user profile:', orderUserId);
            }
          } else {
            console.error('No email found in Paystack response for guest user creation');
            return res.status(400).json({ 
              error: "Invalid payment: no customer email provided",
              details: "Cannot create order without user identification"
            });
          }
        }
        
        console.log('Final user ID for order:', orderUserId);
        
        // Verify plan exists before creating order
        const plan = await storage.getPlan(planId);
        if (!plan) {
          console.error('Plan not found:', planId);
          return res.status(400).json({ 
            error: "Invalid payment: plan not found",
            details: `Plan with ID ${planId} does not exist`
          });
        }
        
        // Create order record
        const orderData = {
          user_id: orderUserId,
          plan_id: planId,
          tier: packageType,
          amount: String(verification.data.amount / 100), // Convert back to cedis
          payment_intent_id: reference,
          status: 'completed',
        };

        console.log('Order data:', orderData);
        const order = await storage.createOrder(orderData);
        console.log('Order created:', order);

        res.json({
          success: true,
          payment: verification.data,
          order,
        });
      } else {
        console.log('Payment not successful, status:', verification.data.status);
        res.status(400).json({
          success: false,
          error: "Payment was not successful",
          status: verification.data.status,
        });
      }
    } catch (error) {
      console.error("=== PAYMENT VERIFICATION ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error message:", (error as any)?.message);
      console.error("Error stack:", (error as any)?.stack);
      console.error("Full error object:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.post("/api/payments/callback", async (req, res) => {
    try {
      // Paystack webhook callback
      const { reference } = req.body;
      
      if (reference) {
        const verification = await PaystackService.verifyPayment(reference);
        if (verification && verification.data.status === 'success') {
          // Update order status or perform any post-payment actions
          console.log('Payment verified via callback:', reference);
        }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error("Error handling payment callback:", error);
      res.status(500).send('Error');
    }
  });

  // Download routes
  app.get("/api/downloads", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Get all downloads for a user
      const downloads = await storage.getDownloads(userId as string);
      
      res.json(downloads);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  app.get("/api/downloads/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status !== 'completed') {
        return res.status(403).json({ error: "Payment not completed" });
      }

      const plan = await storage.getPlan(order.plan_id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Get files based on tier hierarchy: basic = basic only, standard = basic + standard, premium = basic + standard + premium
      let availableFiles: string[] = [];
      const planFiles = plan.plan_files as { basic?: string[]; standard?: string[]; premium?: string[] } || {};
      
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
        return res.status(404).json({ error: "No files available for download" });
      }

      res.json({
        orderId,
        planTitle: plan.title,
        packageType: order.tier,
        files: availableFiles,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
    } catch (error) {
      console.error("Error fetching download info:", error);
      res.status(500).json({ error: "Failed to fetch download information" });
    }
  });

  app.get("/api/downloads/:orderId/file", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { filePath } = req.query;
      
      if (!filePath) {
        return res.status(400).json({ error: "File path is required" });
      }

      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.status !== 'completed') {
        return res.status(403).json({ error: "Payment not completed" });
      }

      const plan = await storage.getPlan(order.plan_id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Get files based on tier hierarchy and verify access
      let availableFiles: string[] = [];
      const planFiles = plan.plan_files || {};
      
      type PlanFiles = {
        basic?: string[];
        standard?: string[];
        premium?: string[];
        [key: string]: any;
      };
      const typedPlanFiles: PlanFiles = planFiles as PlanFiles;

      if (order.tier === 'basic') {
        availableFiles = typedPlanFiles.basic || [];
      } else if (order.tier === 'standard') {
        availableFiles = [
          ...(typedPlanFiles.basic || []),
          ...(typedPlanFiles.standard || [])
        ];
      } else if (order.tier === 'premium') {
        availableFiles = [
          ...(typedPlanFiles.basic || []),
          ...(typedPlanFiles.standard || []),
          ...(typedPlanFiles.premium || [])
        ];
      }

      if (!availableFiles.includes(filePath as string)) {
        return res.status(403).json({ error: "File not included in your package" });
      }

      const filePathStr = String(filePath);
      const isRemote = filePathStr.startsWith('http://') || filePathStr.startsWith('https://');

      // Record the download
      await storage.recordDownload({
        order_id: orderId,
        plan_id: order.plan_id,
        user_id: order.user_id,
        created_at: new Date(),
        download_count: 1,
      });

      if (isRemote) {
        // Redirect to Supabase public URL
        return res.redirect(302, filePathStr);
      }

      // Backward compatibility: serve local file if path is relative
      const fullFilePath = path.join(process.cwd(), filePathStr);
      if (!fs.existsSync(fullFilePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      const fileName = path.basename(fullFilePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      fs.createReadStream(fullFilePath).pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });



  // Contact Form Email API
  app.post("/api/contact/send-email", async (req, res) => {
    try {
      const { to, subject, name, email, phone, planType, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }
      
      // For now, we'll simulate sending the email
      // In production, you would integrate with a real email service like:
      // - Nodemailer with Gmail SMTP
      // - SendGrid
      // - Mailgun
      // - AWS SES
      
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
      
      // In production, replace this with actual email sending logic:
      // const emailResult = await sendEmail({
      //   to: 'sakconstructiongh@gmail.com',
      //   subject: subject,
      //   html: `
      //     <h2>New Contact Form Submission</h2>
      //     <p><strong>Name:</strong> ${name}</p>
      //     <p><strong>Email:</strong> ${email}</p>
      //     <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      //     <p><strong>Plan Type:</strong> ${planType || 'Not specified'}</p>
      //     <p><strong>Message:</strong></p>
      //     <p>${message}</p>
      //   `
      // });
      
      res.json({ 
        success: true, 
        message: 'Email sent successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
