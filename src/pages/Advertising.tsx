import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Star, 
  Eye, 
  Target,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Info,
  Zap,
  Crown,
  Megaphone
} from 'lucide-react';

interface AdPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  features: string[];
  icon: any;
  highlighted?: boolean;
  estimatedViews: string;
  estimatedClicks: string;
}

const Advertising = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string>('spotlight');
  const [adDuration, setAdDuration] = useState<number>(1);
  const [customBudget, setCustomBudget] = useState<string>('');
  const [adContent, setAdContent] = useState({
    title: '',
    description: '',
    targetAudience: '',
    specialOffers: ''
  });

  const adPackages: AdPackage[] = [
    {
      id: 'spotlight',
      name: 'Spotlight Listing',
      price: 50,
      duration: 7,
      description: 'Get your listing featured in the spotlight section',
      icon: Star,
      features: [
        'Homepage placement for 7 days',
        'Highlighted in search results',
        'Priority in category pages',
        'Special "Featured" badge',
        'Basic analytics included',
        'Email notification to interested buyers'
      ],
      estimatedViews: '10,000+',
      estimatedClicks: '200-500'
    },
    {
      id: 'premium',
      name: 'Premium Placement',
      price: 200,
      duration: 14,
      description: 'Maximum visibility across the platform',
      icon: Crown,
      highlighted: true,
      features: [
        'Top banner placement for 14 days',
        'Homepage carousel rotation',
        'Category sponsorship',
        'Social media promotion',
        'Advanced analytics dashboard',
        'Priority customer support',
        'Dedicated account manager',
        'Custom branding options'
      ],
      estimatedViews: '50,000+',
      estimatedClicks: '1,000-2,500'
    },
    {
      id: 'campaign',
      name: 'Marketing Campaign',
      price: 500,
      duration: 30,
      description: 'Full marketing campaign for maximum exposure',
      icon: Megaphone,
      features: [
        'Multi-platform advertising',
        'Google Ads integration',
        'Social media campaign',
        'Email marketing to subscribers',
        'Retargeting campaigns',
        'Video ad creation',
        'Performance optimization',
        'ROI tracking and reporting',
        'A/B testing included'
      ],
      estimatedViews: '200,000+',
      estimatedClicks: '5,000-10,000'
    },
    {
      id: 'custom',
      name: 'Custom Campaign',
      price: 1000,
      duration: 30,
      description: 'Tailored advertising solution for your needs',
      icon: Target,
      features: [
        'Custom strategy development',
        'Dedicated marketing team',
        'Cross-platform integration',
        'Advanced targeting options',
        'Custom creative design',
        'Weekly performance reports',
        'Campaign optimization',
        'Unlimited revisions',
        'White-glove service'
      ],
      estimatedViews: '500,000+',
      estimatedClicks: '10,000+'
    }
  ];

  const selectedAdPackage = adPackages.find(pkg => pkg.id === selectedPackage);

  const calculateTotalPrice = () => {
    if (selectedPackage === 'custom' && customBudget) {
      return parseInt(customBudget) || 1000;
    }
    const basePrice = selectedAdPackage?.price || 0;
    return basePrice * adDuration;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePurchase = () => {
    // Navigate to payment with advertising data
    navigate('/advertising-payment', {
      state: {
        package: selectedAdPackage,
        duration: adDuration,
        totalPrice: calculateTotalPrice(),
        adContent
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Advertising & Promotion</h1>
              <p className="text-gray-600">Boost your listing visibility and sell faster</p>
            </div>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Reach More Buyers with Targeted Advertising</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our advertising solutions help you get maximum exposure for your listings across multiple platforms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ad Packages */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Choose Your Advertising Package</h3>
              <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
                <div className="space-y-4">
                  {adPackages.map((pkg) => {
                    const Icon = pkg.icon;
                    return (
                      <div key={pkg.id}>
                        <RadioGroupItem value={pkg.id} id={pkg.id} className="peer sr-only" />
                        <Label 
                          htmlFor={pkg.id}
                          className={`block cursor-pointer rounded-lg border-2 p-6 transition-all ${
                            selectedPackage === pkg.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          } ${pkg.highlighted ? 'ring-2 ring-primary/20' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-lg ${pkg.highlighted ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                <Icon className={`h-6 w-6 ${pkg.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{pkg.name}</h3>
                                  {pkg.highlighted && (
                                    <Badge className="bg-primary text-white">Best Value</Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{pkg.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Eye className="h-4 w-4 text-blue-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Est. Views</p>
                                      <p className="font-semibold">{pkg.estimatedViews}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Target className="h-4 w-4 text-green-500" />
                                    <div>
                                      <p className="text-xs text-gray-500">Est. Clicks</p>
                                      <p className="font-semibold">{pkg.estimatedClicks}</p>
                                    </div>
                                  </div>
                                </div>

                                <ul className="space-y-2 mb-4">
                                  {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-2xl font-bold text-primary">
                                      {formatPrice(pkg.price)}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">/{pkg.duration} days</span>
                                  </div>
                                </div>
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

            {/* Duration Selection */}
            {selectedPackage !== 'custom' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Campaign Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((weeks) => (
                      <div key={weeks}>
                        <RadioGroupItem value={weeks.toString()} id={`duration-${weeks}`} className="peer sr-only" />
                        <Label 
                          htmlFor={`duration-${weeks}`}
                          className={`block cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                            adDuration === weeks 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full border-2 border-primary peer-checked:bg-primary flex items-center justify-center mx-auto mb-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <p className="font-semibold">{weeks} Week{weeks > 1 ? 's' : ''}</p>
                          <p className="text-sm text-gray-600">{weeks * 7} days</p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Budget */}
            {selectedPackage === 'custom' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Custom Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budget">Campaign Budget (GHS)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="Enter your budget (minimum GHS 1,000)"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        min="1000"
                      />
                    </div>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Minimum budget is GHS 1,000. Our team will create a custom campaign strategy based on your budget.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Campaign Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package</span>
                      <span className="font-medium">{selectedAdPackage?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {selectedPackage === 'custom' ? 'Custom' : `${adDuration} week${adDuration > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span>{formatPrice(selectedAdPackage?.price || 0)}</span>
                    </div>
                    {selectedPackage !== 'custom' && adDuration > 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration Multiplier</span>
                        <span>×{adDuration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Expected Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Est. Views
                      </span>
                      <span className="font-medium">{selectedAdPackage?.estimatedViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Est. Clicks
                      </span>
                      <span className="font-medium">{selectedAdPackage?.estimatedClicks}</span>
                    </div>
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
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Your campaign will start within 24 hours after payment confirmation.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handlePurchase}
                  className="w-full"
                  size="lg"
                >
                  Purchase Campaign
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By purchasing this campaign, you agree to our Advertising Terms and Conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
