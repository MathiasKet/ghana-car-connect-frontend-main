import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, RefreshCw, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

interface PaymentFailedState {
  reference: string;
  amount: number;
  currency: string;
  type: 'listing' | 'subscription' | 'services';
  error?: string;
  message?: string;
}

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentFailedState | null>(null);

  useEffect(() => {
    const state = location.state as PaymentFailedState;
    if (state) {
      setPaymentData(state);
    } else {
      // Try to get payment data from localStorage
      const storedData = localStorage.getItem('lastPayment');
      if (storedData) {
        try {
          setPaymentData(JSON.parse(storedData));
        } catch (error) {
          console.error('Failed to parse stored payment data:', error);
        }
      }
    }
  }, [location.state]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRetryPayment = () => {
    if (paymentData?.type === 'listing') {
      navigate('/payment', { 
        state: { 
          listingData: { featuredListing: false, price: paymentData.amount },
          amount: paymentData.amount,
          description: 'Retry car listing payment'
        }
      });
    } else if (paymentData?.type === 'subscription') {
      navigate('/subscription-plans');
    } else if (paymentData?.type === 'services') {
      navigate('/value-added-services');
    } else {
      navigate('/payment');
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'listing':
        return 'Car Listing';
      case 'subscription':
        return 'Subscription Plan';
      case 'services':
        return 'Value-Added Services';
      default:
        return 'Payment';
    }
  };

  const getErrorMessage = (error?: string, message?: string) => {
    if (message) return message;
    if (error) return error;
    return 'Your payment could not be processed. Please try again or contact support if the problem persists.';
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Payment information not found.</p>
            <Button onClick={() => navigate('/dashboard')} className="mr-2">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/payment')}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-lg font-semibold">Payment Failed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Error Message */}
          <Card className="mb-8 border-red-200">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Failed
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                We couldn't process your payment
              </p>
              <p className="text-gray-500 mb-8">
                {getErrorMessage(paymentData.error, paymentData.message)}
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleRetryPayment}
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction Reference</p>
                  <p className="font-mono font-semibold">{paymentData.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-semibold">{getTypeDescription(paymentData.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(paymentData.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-red-600">Failed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>What You Can Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Common Issues:</strong>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    <li>Insufficient funds in your account</li>
                    <li>Incorrect card details or expired card</li>
                    <li>Network connectivity issues</li>
                    <li>Daily transaction limits exceeded</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Check your payment details</p>
                    <p className="text-sm text-gray-600">Ensure your card details are correct and have sufficient funds.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Try a different payment method</p>
                    <p className="text-sm text-gray-600">You can try using a different card or mobile money option.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Contact support</p>
                    <p className="text-sm text-gray-600">If the problem persists, our support team is here to help.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-medium mb-2">Need Help?</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> support@carconnect.com</p>
                  <p><strong>Phone:</strong> +233 24 123 4567</p>
                  <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM GMT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
