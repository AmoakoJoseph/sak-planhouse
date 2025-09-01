
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  metadata: {
    planId: string;
    planTitle: string;
    package: string;
    userId?: string;
  };
}

export async function createPaymentIntent(data: CreatePaymentIntentRequest) {
  return await stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100), // Convert to cents
    currency: data.currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: data.metadata,
  });
}

export async function confirmPayment(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}
