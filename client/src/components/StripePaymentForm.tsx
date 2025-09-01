
import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { stripePromise, createPaymentIntent, confirmPayment, type PaymentData } from '@/lib/stripe';

interface PaymentFormProps {
  paymentData: PaymentData;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

const PaymentForm = ({ paymentData, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await createPaymentIntent(paymentData);

      // Confirm payment with card
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm with backend
        const result = await confirmPayment(paymentIntentId);
        onSuccess(result);
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Secure payment powered by Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-background">
            <CardElement options={cardElementOptions} />
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || loading || processing}
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Pay ₵{paymentData.amount.toLocaleString()}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured with SSL encryption and processed by Stripe.
      </p>
    </form>
  );
};

interface StripePaymentFormProps {
  paymentData: PaymentData;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

export const StripePaymentForm = ({ paymentData, onSuccess, onError }: StripePaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        paymentData={paymentData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};
