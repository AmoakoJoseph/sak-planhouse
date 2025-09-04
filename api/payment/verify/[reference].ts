import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { PaystackService } from '../../server/paystack';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;
    console.log('=== PAYMENT VERIFICATION DEBUG ===');
    console.log('Verifying payment with reference:', reference);

    if (!reference || typeof reference !== 'string') {
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
      
      // Get user ID from metadata or find/create user
      let orderUserId = verification.data.metadata?.userId;
      
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
            await storage.createProfile(profileData);
            console.log('Created new user profile:', orderUserId);
          }
        } else {
          console.log('No email found in Paystack response, creating guest user...');
          const { randomUUID } = await import('crypto');
          orderUserId = randomUUID();
        }
      }
      
      console.log('Final user ID for order:', orderUserId);
      
      // Create order record
      const orderData = {
        user_id: orderUserId,
        plan_id: verification.data.metadata.planId,
        tier: verification.data.metadata.packageType,
        amount: String(verification.data.amount / 100), // Convert back to cedis
        payment_intent_id: reference,
        status: 'completed',
      };

      console.log('Order data:', orderData);
      const order = await storage.createOrder(orderData);
      console.log('Order created:', order);

      // Redirect to success page or return success response
      res.redirect(`/download/${order.id}`);
    } else {
      console.log('Payment not successful, status:', verification.data.status);
      res.redirect('/?payment=failed');
    }
  } catch (error) {
    console.error("=== PAYMENT VERIFICATION ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", (error as any)?.message);
    console.error("Error stack:", (error as any)?.stack);
    console.error("Full error object:", error);
    res.redirect('/?payment=error');
  }
}
