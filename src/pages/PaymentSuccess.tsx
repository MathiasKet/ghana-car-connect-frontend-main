import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Receipt, ArrowLeft } from 'lucide-react';
import PaymentService from '@/services/paymentService';

interface PaymentSuccessState {
  reference: string;
  amount: number;
  currency: string;
  type: 'listing' | 'subscription' | 'services';
  message?: string;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentSuccessState | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const state = location.state as PaymentSuccessState;
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

    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleDownloadReceipt = () => {
    if (paymentData?.reference) {
      PaymentService.generateReceipt(paymentData.reference);
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

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No payment data found.</p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="mt-4"
            >
              Go to Dashboard
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
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold">Payment Successful</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Thank you for your payment
              </p>
              <p className="text-gray-500 mb-6">
                {paymentData.message || 'Your transaction has been completed successfully.'}
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  size="lg"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
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
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(paymentData.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-600">Completed</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Auto-redirect:</strong> You will be redirected to your dashboard in {countdown} seconds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentData.type === 'listing' && (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Your car listing is now active</p>
                        <p className="text-sm text-gray-600">Potential buyers can now view and contact you about your car.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Manage your listing</p>
                        <p className="text-sm text-gray-600">Visit your dashboard to track views, inquiries, and update your listing.</p>
                      </div>
                    </div>
                  </>
                )}
                {paymentData.type === 'subscription' && (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Premium features activated</p>
                        <p className="text-sm text-gray-600">You now have access to all premium features and benefits.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Manage subscription</p>
                        <p className="text-sm text-gray-600">View your subscription details and manage billing in your dashboard.</p>
                      </div>
                    </div>
                  </>
                )}
                {paymentData.type === 'services' && (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Service request received</p>
                        <p className="text-sm text-gray-600">Our team will contact you shortly to discuss your service requirements.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Track progress</p>
                        <p className="text-sm text-gray-600">Monitor your service requests and communications in your dashboard.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
