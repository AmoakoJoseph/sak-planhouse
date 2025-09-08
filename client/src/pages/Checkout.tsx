import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PaystackPayment } from '@/components/PaystackPayment';
import { api } from '@/lib/api';

const Checkout = () => {
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mock user state for demonstration. Replace with actual auth state.
  const user = null; // Example: user = { id: '123', name: 'John Doe' }
  const selectedPackage = checkoutData?.package || 'basic'; // Default to basic
  const plan = { title: checkoutData?.planTitle || 'Basic Plan' }; // Mock plan title
  const packagePrices = {
    basic: 50.00,
    standard: 100.00,
    premium: 150.00,
  }; // Mock prices

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      if (reference) {
        setVerifying(true);
        try {
          const response = await api.post('/api/payments/verify', { reference });
          if (response.data.success) {
            setPaymentSuccess(true);
            localStorage.removeItem('checkoutData');
          } else {
            setPaymentError('Payment verification failed');
          }
        } catch (error) {
          setPaymentError('Payment verification failed');
        } finally {
          setVerifying(false);
        }
      }
    };

    // Get checkout data from localStorage
    const data = localStorage.getItem('checkoutData');
    if (data) {
      setCheckoutData(JSON.parse(data));
      verifyPayment();
    } else if (!searchParams.get('reference')) {
      // No checkout data and no payment reference, redirect to plans
      navigate('/plans');
    }
    setLoading(false);
  }, [navigate, searchParams]);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);

    if (paymentData.order && paymentData.order.id) {
      // For premium packages, require account creation
      if (selectedPackage === 'premium' && !user) {
        // Store order info in localStorage and redirect to register
        localStorage.setItem('pendingPremiumOrder', JSON.stringify({
          orderId: paymentData.order.id,
          planTitle: plan.title,
          packageType: selectedPackage
        }));
        navigate('/auth/register');
      } else {
        navigate(`/download/${paymentData.order.id}`);
      }
    } else {
      console.error('Order ID not found in payment data');
      setPaymentError('Payment completed but order information is missing. Please contact support.');
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {verifying ? 'Verifying payment...' : 'Loading checkout...'}
          </p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your house plan will be available for download shortly.
            A receipt has been sent to your email.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/user/orders">View My Orders</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/plans">Browse More Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Checkout Data</h1>
          <p className="text-muted-foreground mb-6">Please select a plan to checkout.</p>
          <Button asChild>
            <Link to="/plans">Back to Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/plans">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plans
                </Link>
              </Button>
              <Badge variant="secondary">Checkout</Badge>
            </div>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Your Purchase
              </h1>
              <p className="text-lg text-muted-foreground">
                Secure payment for your house plan
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{checkoutData.planTitle}</h3>
                      <p className="text-sm text-muted-foreground">{checkoutData.packageName}</p>
                      <p className="text-xs text-muted-foreground">Designed by {checkoutData.architect}</p>
                    </div>
                    <Badge variant="secondary">{checkoutData.package}</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Package Type:</span>
                      <Badge variant="secondary" className="capitalize">
                        {selectedPackage}
                      </Badge>
                    </div>
                    {selectedPackage === 'premium' && !user && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Premium Package:</strong> Account creation required for download access.
                          You'll be prompted to create an account after payment.
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-lg font-bold">
                        GH₵ {packagePrices[selectedPackage as keyof typeof packagePrices].toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                  <CardDescription>Your {checkoutData.packageName} includes:</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Professional architectural plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Instant download after payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Technical support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              {paymentError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{paymentError}</p>
                </div>
              )}

              <PaystackPayment
                planId={checkoutData.planId}
                planTitle={checkoutData.planTitle}
                packageType={checkoutData.package}
                amount={checkoutData.price}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;