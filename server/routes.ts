import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { PaystackService } from "./paystack";

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

  // Payment routes
  app.post("/api/payments/initialize", async (req, res) => {
    try {
      const { email, amount, planId, planTitle, packageType } = req.body;

      if (!email || !amount || !planId) {
        return res.status(400).json({ error: "Missing required payment data" });
      }

      const reference = PaystackService.generateReference();
      const amountInKobo = Math.round(amount * 100); // Convert cedis to kobo

      const paymentData = {
        email,
        amount: amountInKobo,
        reference,
        callback_url: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        metadata: {
          planId,
          planTitle,
          packageType,
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

      const result = await PaystackService.initializePayment(paymentData);

      if (result.success) {
        res.json({
          success: true,
          authorization_url: result.data.authorization_url,
          access_code: result.data.access_code,
          reference: result.data.reference,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      res.status(500).json({ error: "Failed to initialize payment" });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { reference } = req.body;

      if (!reference) {
        return res.status(400).json({ error: "Payment reference is required" });
      }

      const verification = await PaystackService.verifyPayment(reference);

      if (!verification) {
        return res.status(400).json({ error: "Payment verification failed" });
      }

      if (verification.data.status === 'success') {
        // Create order record
        const orderData = {
          user_id: 'guest', // You may want to implement user sessions
          plan_id: verification.data.metadata.planId,
          package_type: verification.data.metadata.packageType,
          amount: verification.data.amount / 100, // Convert back to cedis
          payment_reference: reference,
          payment_status: 'completed',
          payment_method: 'paystack',
        };

        const order = await storage.createOrder(orderData);

        res.json({
          success: true,
          payment: verification.data,
          order,
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Payment was not successful",
          status: verification.data.status,
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
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
  app.get("/api/downloads/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.payment_status !== 'completed') {
        return res.status(403).json({ error: "Payment not completed" });
      }

      const plan = await storage.getPlan(order.plan_id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Get files based on tier hierarchy: basic = basic only, standard = basic + standard, premium = basic + standard + premium
      let availableFiles: string[] = [];
      const planFiles = plan.plan_files || {};
      
      if (order.package_type === 'basic') {
        availableFiles = planFiles.basic || [];
      } else if (order.package_type === 'standard') {
        availableFiles = [
          ...(planFiles.basic || []),
          ...(planFiles.standard || [])
        ];
      } else if (order.package_type === 'premium') {
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
        packageType: order.package_type,
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

      if (order.payment_status !== 'completed') {
        return res.status(403).json({ error: "Payment not completed" });
      }

      const plan = await storage.getPlan(order.plan_id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Get files based on tier hierarchy and verify access
      let availableFiles: string[] = [];
      const planFiles = plan.plan_files || {};
      
      if (order.package_type === 'basic') {
        availableFiles = planFiles.basic || [];
      } else if (order.package_type === 'standard') {
        availableFiles = [
          ...(planFiles.basic || []),
          ...(planFiles.standard || [])
        ];
      } else if (order.package_type === 'premium') {
        availableFiles = [
          ...(planFiles.basic || []),
          ...(planFiles.standard || []),
          ...(planFiles.premium || [])
        ];
      }

      if (!availableFiles.includes(filePath as string)) {
        return res.status(403).json({ error: "File not included in your package" });
      }

      const fullFilePath = path.join(process.cwd(), filePath as string);
      
      if (!fs.existsSync(fullFilePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Record the download
      await storage.recordDownload({
        order_id: orderId,
        file_path: filePath as string,
        user_id: order.user_id,
      });

      // Set appropriate headers for download
      const fileName = path.basename(fullFilePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Stream the file
      const fileStream = fs.createReadStream(fullFilePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
