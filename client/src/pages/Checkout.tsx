import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { useAuth } from '@/hooks/useAuth';

const Checkout = () => {
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get checkout data from localStorage
    const data = localStorage.getItem('checkoutData');
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      // No checkout data, redirect to plans
      navigate('/plans');
    }
    setLoading(false);
  }, [navigate]);

  const handlePaymentSuccess = (result: any) => {
    setPaymentSuccess(true);
    setPaymentError(null);
    localStorage.removeItem('checkoutData');
    
    // Redirect to success page or user dashboard after a delay
    setTimeout(() => {
      navigate('/user/orders', { 
        state: { 
          message: 'Payment successful! Your house plan is now available for download.' 
        }
      });
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
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
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">₵{checkoutData.price}</span>
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

            {/* Payment Form */}
            <div className="space-y-6">
              {paymentError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}

              {paymentSuccess ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Payment Successful!</h3>
                        <p className="text-muted-foreground">
                          Your house plan is now available for download.
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/user/orders">View My Orders</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <StripePaymentForm
                  paymentData={{
                    planId: checkoutData.planId,
                    planTitle: checkoutData.planTitle,
                    package: checkoutData.package,
                    amount: checkoutData.price,
                    userId: user?.id
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
