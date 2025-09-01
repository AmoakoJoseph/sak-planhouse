import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { stripe, createPaymentIntent, confirmPayment } from "./stripe";

// Multer configuration for file uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const planFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tier = req.body.tier || 'basic';
    const planId = req.body.planId || 'temp';
    const uploadPath = `uploads/plans/${tier}/`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadImage = multer({ 
  storage: imageStorage,
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
  storage: planFileStorage,
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

  // File Upload API
  app.post("/api/upload/image", uploadImage.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      res.json({ 
        filename: req.file.filename,
        path: `/uploads/images/${req.file.filename}`,
        url: `/uploads/images/${req.file.filename}`
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/plan-files", uploadPlanFile.fields([
    { name: 'basic', maxCount: 5 },
    { name: 'standard', maxCount: 5 },
    { name: 'premium', maxCount: 5 }
  ]), (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedFiles: { [tier: string]: string[] } = {};
      
      for (const tier in files) {
        uploadedFiles[tier] = files[tier].map(file => `/uploads/plans/${tier}/${file.filename}`);
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

  app.put("/api/profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Authentication API
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // For the admin user, check credentials
      if (email === 'admin@sakconstructionsgh.com' && password === 'admin123') {
        const profile = await storage.getProfileByEmail(email);
        if (profile) {
          res.json({
            user: { id: profile.user_id, email: profile.email },
            profile
          });
          return;
        }
      }
      
      res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    res.json({ success: true });
  });

  // Payment endpoints
  app.post("/api/payments/create-intent", async (req, res) => {
    try {
      const { amount, currency = 'ghs', planId, planTitle, package: planPackage, userId } = req.body;
      
      if (!amount || !planId || !planTitle || !planPackage) {
        return res.status(400).json({ error: "Missing required payment data" });
      }

      const paymentIntent = await createPaymentIntent({
        amount,
        currency,
        metadata: {
          planId,
          planTitle,
          package: planPackage,
          userId: userId || 'guest'
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }

      const paymentIntent = await confirmPayment(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Create order in database
        const orderData = {
          user_id: paymentIntent.metadata.userId !== 'guest' ? paymentIntent.metadata.userId : null,
          plan_id: paymentIntent.metadata.planId,
          package_type: paymentIntent.metadata.package,
          total_amount: paymentIntent.amount / 100, // Convert back from cents
          payment_status: 'completed',
          payment_method: 'stripe',
          stripe_payment_intent_id: paymentIntent.id
        };

        const order = await storage.createOrder(orderData);
        
        res.json({
          success: true,
          order,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100
          }
        });
      } else {
        res.status(400).json({ 
          error: "Payment not completed", 
          status: paymentIntent.status 
        });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Stripe webhook endpoint
  app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          // Additional processing if needed
          break;
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.log('Payment failed:', failedPayment.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      res.status(400).json({ error: 'Invalid signature' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
