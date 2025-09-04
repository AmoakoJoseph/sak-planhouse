
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, User, LogIn } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Debug authentication state
  console.log('PaystackPayment - Auth state:', { isAuthenticated, user });

  const handlePayment = async () => {
    console.log('handlePayment called - Auth state:', { isAuthenticated, user });
    
    if (!isAuthenticated) {
      onError('Please sign in to make a purchase');
      return;
    }

    if (!email) {
      onError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Debug: Log the payment data being sent
      const paymentData = {
        email,
        amount,
        planId,
        planTitle,
        packageType,
        userId: user?.id, // Include user ID
      };
      console.log('Sending payment data:', paymentData);
      console.log('Payment data types:', {
        email: typeof email,
        amount: typeof amount,
        planId: typeof planId,
        planTitle: typeof planTitle,
        packageType: typeof packageType,
        userId: typeof user?.id
      });

      // Initialize payment with Paystack
      const response = await api.initializePayment(paymentData);

      if (response.success) {
        // Redirect to Paystack payment page
        window.location.href = response.authorization_url;
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

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sign In Required
          </CardTitle>
          <CardDescription>
            You need to sign in to make a purchase. This helps us track your orders and provide better service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

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
