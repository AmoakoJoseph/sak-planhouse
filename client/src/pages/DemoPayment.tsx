import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';

export default function DemoPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  
  const reference = searchParams.get('reference');
  const amount = searchParams.get('amount');
  const email = searchParams.get('email');

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    alert('Demo mode: Download would start here');
  };

  const handleBackToPlans = () => {
    navigate('/plans');
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <CardTitle>Processing Payment...</CardTitle>
            <CardDescription>Please wait while we process your demo payment</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-gray-600">
              <p>Reference: {reference}</p>
              <p>Amount: GH₵{(Number(amount) / 100).toFixed(2)}</p>
              <p>Email: {email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
          <CardDescription>Your demo payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <p>Reference: {reference}</p>
            <p>Amount: GH₵{(Number(amount) / 100).toFixed(2)}</p>
            <p>Email: {email}</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleDownload} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Plans
            </Button>
            
            <Button 
              onClick={handleBackToPlans} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
            <p>💡 This is a demo payment. In production, you would be redirected to Paystack for real payment processing.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
