import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Shield,
  Smartphone,
  Building,
  AlertCircle
} from 'lucide-react';
import PaystackService from '@/services/paystackService';
import { useAuthStore } from '@/store/authStore';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
}

interface ServicesPaymentData {
  selectedServices: Service[];
  totalPrice: number;
}

const ServicesPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [paymentData, setPaymentData] = useState<ServicesPaymentData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (location.state) {
      setPaymentData(location.state as ServicesPaymentData);
    } else {
      navigate('/value-added-services');
    }
  }, [navigate, location.state, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePayment = async () => {
    if (!paymentData || !user) {
      setError('Payment data or user information missing');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const services = paymentData.selectedServices.map(service => service.id);
      const totalAmount = paymentData.totalPrice * 1.02; // Include processing fee

      // Process payment with Paystack
      const paymentResponse = await PaystackService.processServicesPayment(services, {
        email: user.email,
        amount: totalAmount,
        currency: 'GHS',
        metadata: {
          userId: user.id,
          userName: user.name,
          services: paymentData.selectedServices,
          originalAmount: paymentData.totalPrice,
          processingFee: paymentData.totalPrice * 0.02
        }
      });

      if (paymentResponse.status === 'success') {
        toast.success('Payment successful! Redirecting...');
        setCurrentStep(3); // Success step
        
        // Redirect to dashboard after success
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error(paymentResponse.message || 'Payment failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your payment of {formatPrice(paymentData.totalPrice)} has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/value-added-services')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Service Payment</h1>
                <p className="text-gray-600">Complete your service purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your selected services before payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Services List */}
                <div className="space-y-4">
                  {paymentData.selectedServices.map((service, index) => (
                    <div key={service.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Duration: {service.duration}</span>
                          <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(paymentData.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span>{formatPrice(paymentData.totalPrice * 0.02)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatPrice(paymentData.totalPrice * 1.02)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>
                  Choose how you want to pay for your services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <RadioGroup value="paystack" onValueChange={() => {}}>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 border-primary bg-primary/5">
                    <RadioGroupItem value="paystack" id="paystack" checked />
                    <Label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4" />
                      <div>
                        <span className="font-medium">Paystack Secure Payment</span>
                        <p className="text-sm text-gray-600">Card, Mobile Money, Bank Transfer, USSD</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(paymentData.totalPrice * 1.02)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this payment, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment is secured with 256-bit SSL encryption. Your financial information is safe.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPayment;
