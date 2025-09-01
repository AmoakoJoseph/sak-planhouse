
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface PaystackPaymentProps {
  planId: string;
  planTitle: string;
  packageType: string;
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export const PaystackPayment = ({
  planId,
  planTitle,
  packageType,
  amount,
  onSuccess,
  onError,
}: PaystackPaymentProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      onError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Initialize payment with Paystack
      const response = await api.post('/api/payments/initialize', {
        email,
        amount,
        planId,
        planTitle,
        packageType,
      });

      if (response.data.success) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        onError('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment with Paystack
        </CardTitle>
        <CardDescription>
          Secure payment powered by Paystack. You'll be redirected to complete your payment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Receipt and download link will be sent to this email
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={handlePayment}
            disabled={loading || !email}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              `Pay ₵${amount} with Paystack`
            )}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Powered by Paystack - Secure SSL encryption
          </p>
          <p className="text-xs text-muted-foreground">
            Supports cards, mobile money, bank transfer, and USSD
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
