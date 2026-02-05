import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Shield,
  Smartphone,
  Building,
  Car,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';
import PaystackService, { PaymentData as PaystackPaymentData } from '@/services/paystackService';

interface PaymentData {
  listingData: any;
  amount: number;
  description: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    if (location.state) {
      setPaymentData(location.state as PaymentData);
    } else {
      navigate('/list-car');
    }
  }, [navigate, location.state]);

  const paymentMethods = [
    {
      id: 'paystack',
      type: 'paystack',
      provider: 'Paystack',
      description: 'Pay with Card, Mobile Money, Bank Transfer, or USSD',
      isDefault: true,
      isVerified: true
    }
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!user || !paymentData) {
      setError('User or payment data missing');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const paystackData: PaystackPaymentData = {
        email: user.email,
        amount: paymentData.amount,
        currency: 'GHS',
        metadata: {
          type: 'listing',
          listingData: paymentData.listingData,
          userId: user.id,
          featuredListing: paymentData.listingData.featuredListing
        },
        callback: (response) => {
          setCurrentStep(3);
          
          // Store payment data for success/failed pages
          const paymentState = {
            reference: response.reference,
            amount: paymentData.amount,
            currency: 'GHS',
            type: paymentData.listingData.featuredListing ? 'listing' : 'listing',
            message: response.message
          };
          localStorage.setItem('lastPayment', JSON.stringify(paymentState));
          
          setTimeout(() => {
            if (response.status === 'success') {
              navigate('/payment/success', { state: paymentState });
            } else {
              navigate('/payment/failed', { 
                state: { 
                  ...paymentState, 
                  error: response.message || 'Payment failed' 
                }
              });
            }
          }, 2000);
        },
        onClose: () => {
          setIsProcessing(false);
          setError('Payment was cancelled. Please try again.');
          // Navigate to failed page with cancellation message
          const paymentState = {
            reference: paystackData.reference || '',
            amount: paymentData.amount,
            currency: 'GHS',
            type: 'listing',
            message: 'Payment was cancelled by user'
          };
          localStorage.setItem('lastPayment', JSON.stringify(paymentState));
          setTimeout(() => {
            navigate('/payment/failed', { state: paymentState });
          }, 1000);
        }
      };

      const result = await PaystackService.processListingPayment(
        paymentData.listingData.id || 'temp_listing_id',
        paystackData
      );

      if (result.status === 'success') {
        setCurrentStep(3);
        const paymentState = {
          reference: result.reference,
          amount: paymentData.amount,
          currency: 'GHS',
          type: 'listing',
          message: 'Your car listing payment was successful!'
        };
        localStorage.setItem('lastPayment', JSON.stringify(paymentState));
        setTimeout(() => {
          navigate('/payment/success', { state: paymentState });
        }, 2000);
      } else {
        setError(result.message || 'Payment failed. Please try again.');
        const paymentState = {
          reference: result.reference || '',
          amount: paymentData.amount,
          currency: 'GHS',
          type: 'listing',
          error: result.message || 'Payment failed'
        };
        localStorage.setItem('lastPayment', JSON.stringify(paymentState));
        setTimeout(() => {
          navigate('/payment/failed', { state: paymentState });
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'paystack': return <CreditCard className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'mobile_money': return <Smartphone className="h-5 w-5" />;
      case 'bank_transfer': return <Building className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  if (!user || !paymentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/list-car')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Complete Payment</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className={`w-16 h-1 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <div className={`w-16 h-1 ${
                currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      Review your listing details before payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Car Details */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-primary rounded-lg">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {paymentData.listingData.make} {paymentData.listingData.model}
                        </h4>
                        <p className="text-sm text-gray-600">{paymentData.listingData.year}</p>
                        <p className="text-sm text-gray-600">{paymentData.listingData.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(paymentData.listingData.price)}
                        </p>
                      </div>
                    </div>

                    {/* Listing Type */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Listing Type</h4>
                      {paymentData.listingData.featuredListing ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-center space-x-3">
                            <Star className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Featured Listing</p>
                              <p className="text-sm text-gray-600">30 days with priority placement</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Standard Listing</p>
                              <p className="text-sm text-gray-600">30 days regular listing</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Standard</Badge>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Fee</span>
                        <span>{formatPrice(paymentData.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee</span>
                        <span>GHS 0</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-primary">{formatPrice(paymentData.amount)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)} 
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                    <CardDescription>
                      Choose how you want to pay for your listing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getPaymentIcon(method.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{method.provider}</h4>
                                {method.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                                {method.isVerified && (
                                  <Badge variant="outline" className="text-green-600">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handlePayment} 
                        disabled={!selectedPaymentMethod || isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Processing...' : `Pay ${formatPrice(paymentData.amount)}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 mb-6">
                      Your payment of {formatPrice(paymentData.amount)} has been processed successfully.
                    </p>
                    <p className="text-sm text-gray-500">
                      Redirecting you to your dashboard...
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your payment is secured with 256-bit SSL encryption. Your financial information is safe.
                </AlertDescription>
              </Alert>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Listing Type</span>
                    <span className="text-sm font-medium">
                      {paymentData.listingData.featuredListing ? 'Featured' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">30 days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(paymentData.amount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    If you encounter any issues with your payment, our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> support@carconnect.com
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> +233 24 123 4567
                    </p>
                    <p className="text-sm">
                      <strong>Hours:</strong> Mon-Fri, 9AM-6PM GMT
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
