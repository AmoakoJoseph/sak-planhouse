
import { loadStripe } from '@stripe/stripe-js';

// Get publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...'; // Replace with your actual key

if (!stripePublishableKey) {
  throw new Error('VITE_STRIPE_PUBLISHABLE_KEY environment variable is required');
}

export const stripePromise = loadStripe(stripePublishableKey);

export interface PaymentData {
  planId: string;
  planTitle: string;
  package: string;
  amount: number;
  userId?: string;
}

export async function createPaymentIntent(paymentData: PaymentData) {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
}

export async function confirmPayment(paymentIntentId: string) {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }

  return response.json();
}
