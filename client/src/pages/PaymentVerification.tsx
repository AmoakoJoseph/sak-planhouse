import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      
      if (!reference && !trxref) {
        setError('No payment reference found');
        setVerifying(false);
        return;
      }

      try {
        const paymentRef = reference || trxref;
        console.log('Verifying payment with reference:', paymentRef);
        
        // Use GET request with reference as URL parameter
        const response = await fetch(`/api/payments/verify/${paymentRef}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment verification failed:', response.status, errorText);
          setError('Payment verification failed. Please contact support.');
          return;
        }
        
        const responseData = await response.json();
        console.log('Payment verification response:', responseData);
        
        if (responseData.success && responseData.order) {
          setSuccess(true);
          setOrderId(responseData.order.id);
          
          // Redirect to download page after a short delay
          setTimeout(() => {
            navigate(`/download/${responseData.order.id}`);
          }, 2000);
        } else {
          setError('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg">Verifying your payment...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>Your payment has been verified successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Redirecting you to your downloads...
            </p>
            <Button 
              onClick={() => navigate(`/download/${orderId}`)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Downloads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/plans')}
            variant="outline"
            className="w-full"
          >
            Back to Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentVerification;
