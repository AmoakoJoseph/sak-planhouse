
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Shield, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DownloadManager } from '@/components/DownloadManager';
import { useAuth } from '@/hooks/useAuth';

const DownloadPage = () => {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for pending premium order that requires account creation
    const pendingOrder = localStorage.getItem('pendingPremiumOrder');
    if (pendingOrder && !user) {
      const orderInfo = JSON.parse(pendingOrder);
      if (orderInfo.orderId === orderId) {
        navigate('/auth/register');
        return;
      }
    }
    
    // For premium downloads, require user account
    if (!user && orderId) {
      // Check if this is a premium order by making a quick API call
      const checkOrderType = async () => {
        try {
          const response = await fetch(`/api/downloads/${orderId}`);
          const data = await response.json();
          // Redirect to home page where user can access AuthModal
          navigate('/');
        } catch {
          // Redirect to home page where user can access AuthModal
          navigate('/');
        }
      };
      checkOrderType();
    }
  }, [user, navigate, orderId]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Download Link</h1>
          <p className="text-muted-foreground mb-6">The download link is invalid or missing.</p>
          <Button asChild>
            <Link to="/user/orders">Back to Orders</Link>
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
                <Link to="/user/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              <Badge variant="secondary">Download Center</Badge>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Download Your Plans
              </h1>
              <p className="text-lg text-muted-foreground">
                Access your purchased architectural plans and documents
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Download Manager */}
            <div className="lg:col-span-2">
              <DownloadManager orderId={orderId} />
            </div>

            {/* Download Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Download Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Secure download links</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Verified payment required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>7-day download window</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Having trouble with your download?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    If you're experiencing issues downloading your files, please contact our support team.
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
