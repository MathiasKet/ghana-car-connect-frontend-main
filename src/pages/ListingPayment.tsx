import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  Clock,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import PaystackService from '@/services/paystackService';

interface ListingOption {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  highlighted?: boolean;
  icon: any;
}

const ListingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [carData, setCarData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.carData) {
      setCarData(location.state.carData);
    } else {
      navigate('/sell');
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location.state, navigate]);

  const listingOptions: ListingOption[] = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 20,
      duration: 30,
      icon: Car,
      features: [
        '30-day listing duration',
        'Standard placement in search results',
        'Basic seller profile',
        'Email support',
        'Up to 10 photos'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Listing',
      price: 50,
      duration: 60,
      icon: Star,
      highlighted: true,
      features: [
        '60-day listing duration',
        'Priority placement in search results',
        'Enhanced seller profile',
        'Priority customer support',
        'Up to 20 photos',
        'Basic analytics',
        'Social media promotion'
      ]
    },
    {
      id: 'featured',
      name: 'Featured Listing',
      price: 100,
      duration: 90,
      icon: TrendingUp,
      features: [
        '90-day listing duration',
        'Top placement in search results',
        'Homepage featured section',
        'Premium seller profile',
        'Dedicated support',
        'Up to 30 photos',
        'Advanced analytics',
        'Social media promotion',
        'Highlighted badge'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Listing',
      price: 200,
      duration: 120,
      icon: Shield,
      features: [
        '120-day listing duration',
        'Top placement + homepage banner',
        'Premium featured section',
        'VIP seller profile',
        '24/7 dedicated support',
        'Unlimited photos',
        'Premium analytics dashboard',
        'Full social media campaign',
        'Premium badge',
        'Video listing option',
        'Professional photography discount'
      ]
    }
  ];

  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Paystack',
      description: 'Pay with Card, Mobile Money, Bank Transfer, or USSD',
      icon: CreditCard,
      fee: 0
    }
  ];

  const selectedListingOption = listingOptions.find(option => option.id === selectedOption);
  const selectedPaymentMethod = paymentMethods[0]; // Only Paystack

  const calculateTotalPrice = () => {
    const basePrice = selectedListingOption?.price || 0;
    const processingFee = basePrice * ((selectedPaymentMethod?.fee || 0) / 100);
    return basePrice + processingFee;
  };

  const handlePayment = async () => {
    if (!user) {
      setError('Please login to make payment');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await PaystackService.processListingPayment(
        carData?.id || 'temp_listing_id',
        {
          email: user.email,
          amount: calculateTotalPrice(),
          currency: 'GHS',
          metadata: {
            type: 'listing',
            listingOption: selectedListingOption,
            carData: carData,
            userId: user.id,
            originalAmount: selectedListingOption?.price
          },
          callback: (response) => {
            // Navigate to success page
            navigate('/listing-success', { 
              state: { 
                listingOption: selectedListingOption,
                paymentMethod: selectedPaymentMethod,
                totalPrice: calculateTotalPrice(),
                carData,
                paymentReference: response.reference
              }
            });
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
      setError(err.message || 'Payment failed. Please try again.');
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

  if (!carData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Choose Your Listing Plan</h1>
              <p className="text-gray-600">Select the best option to sell your {carData.brand} {carData.model}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/sell')}>
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-6xl">
        {/* Car Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <Car className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{carData.brand} {carData.model}</h3>
                <p className="text-gray-600">{carData.year} • {carData.mileage} • {carData.fuel}</p>
                <p className="text-lg font-bold text-primary">{formatPrice(parseInt(carData.price))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Options */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Select Listing Type</h2>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-4">
                  {listingOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                        <Label 
                          htmlFor={option.id}
                          className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            selectedOption === option.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          } ${option.highlighted ? 'ring-2 ring-primary/20' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${option.highlighted ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                <Icon className={`h-5 w-5 ${option.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{option.name}</h3>
                                  {option.highlighted && (
                                    <Badge className="bg-primary text-white">Most Popular</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {option.duration} days • {formatPrice(option.price)}
                                </p>
                                <ul className="space-y-1 text-sm text-gray-700">
                                  {option.features.map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                      <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="w-5 h-5 rounded-full border-2 border-primary peer-checked:bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <Card className="border-primary">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Paystack Secure Payment</h3>
                      <p className="text-sm text-gray-600">
                        Pay with Card, Mobile Money, Bank Transfer, or USSD
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">256-bit SSL Encryption</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Secure</Badge>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Listing Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Car</span>
                      <span>{carData.brand} {carData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listing Type</span>
                      <span>{selectedListingOption?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{selectedListingOption?.duration} days</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listing Fee</span>
                      <span>{formatPrice(selectedListingOption?.price || 0)}</span>
                    </div>
                    {selectedPaymentMethod?.fee && selectedPaymentMethod.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee</span>
                        <span>{formatPrice((selectedListingOption?.price || 0) * (selectedPaymentMethod.fee / 100))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>

                <Alert>
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    You'll be redirected to Paystack's secure payment page to complete your transaction.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(calculateTotalPrice())}`}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By completing this payment, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPayment;
