import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Shield,
  Star,
  Crown,
  Gem,
  Car,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import PaystackService from '@/services/paystackService';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  benefits: {
    listingDiscount: number;
    freeListings: number;
    featuredDiscount: number;
    prioritySupport: boolean;
    analytics: boolean;
    bulkListing: boolean;
    verifiedBadge: boolean;
  };
}

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paystack');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
      return;
    }

    if (location.state) {
      const { plan, planId, billingCycle: cycle } = location.state;
      setSelectedPlan(plan);
      setBillingCycle(cycle || 'monthly');
    } else {
      navigate('/subscription-plans');
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

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) {
      setError('Missing plan or user information');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await PaystackService.processSubscriptionPayment(
        selectedPlan.id,
        {
          email: user.email,
          amount: selectedPlan.price,
          currency: 'GHS',
          metadata: {
            type: 'subscription',
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            billingCycle,
            userId: user.id
          },
          callback: (response) => {
            setCurrentStep(3);
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          },
          onClose: () => {
            setError('Payment was cancelled. Please try again.');
          }
        }
      );

      if (result.status === 'failed') {
        setError(result.message || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Subscription failed. Please try again.');
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
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'mobile_money': return <CreditCard className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  if (!user || !selectedPlan) {
    return <div>Loading...</div>;
  }

  const Icon = selectedPlan.icon;
  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/subscription-plans')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Button>
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Subscription Checkout</span>
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
                      Review your subscription details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Plan Details */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-primary rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{selectedPlan.name} Plan</h4>
                        <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                        <p className="text-sm text-gray-600">Billing: {billingCycle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(selectedPlan.price)}
                        </p>
                        <p className="text-sm text-gray-600">/{selectedPlan.duration}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <h4 className="font-medium">What you'll get:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedPlan.features.slice(0, 6).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      {selectedPlan.features.length > 6 && (
                        <p className="text-sm text-gray-600">
                          +{selectedPlan.features.length - 6} more features
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription Fee</span>
                        <span>{formatPrice(selectedPlan.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee</span>
                        <span>GHS 0</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-primary">{formatPrice(selectedPlan.price)}</span>
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
                      Choose how you want to pay for your subscription
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
                        onClick={handleSubscribe} 
                        disabled={!selectedPaymentMethod || isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Processing...' : `Subscribe ${formatPrice(selectedPlan.price)}`}
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription Successful!</h3>
                    <p className="text-gray-600 mb-6">
                      You are now subscribed to the {selectedPlan.name} plan.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-600">Plan: {selectedPlan.name}</p>
                      <p className="text-sm text-gray-600">Amount: {formatPrice(selectedPlan.price)}</p>
                      <p className="text-sm text-gray-600">Billing: {billingCycle}</p>
                    </div>
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
                  Your subscription payment is secured with 256-bit SSL encryption.
                </AlertDescription>
              </Alert>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="text-sm font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Billing Cycle</span>
                    <span className="text-sm font-medium">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{selectedPlan.duration}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(selectedPlan.price)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Key Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedPlan.benefits.listingDiscount > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{selectedPlan.benefits.listingDiscount}% off listing fees</span>
                    </div>
                  )}
                  {selectedPlan.benefits.freeListings > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{selectedPlan.benefits.freeListings} free listings</span>
                    </div>
                  )}
                  {selectedPlan.benefits.prioritySupport && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority customer support</span>
                    </div>
                  )}
                  {selectedPlan.benefits.analytics && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  )}
                  {selectedPlan.benefits.verifiedBadge && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Verified seller badge</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Questions about subscriptions? Our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> support@carconnect.com
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> +233 24 123 4567
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

export default SubscriptionCheckout;
