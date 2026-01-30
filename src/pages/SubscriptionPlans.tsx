import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Gem,
  Car,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Eye,
  CreditCard,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  highlighted?: boolean;
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

const SubscriptionPlans = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      duration: 'Forever',
      description: 'Perfect for occasional sellers',
      icon: Car,
      color: 'text-gray-600',
      features: [
        'List up to 2 cars per month',
        'Standard listing placement',
        'Basic seller profile',
        'Email support',
        '30-day listing duration'
      ],
      benefits: {
        listingDiscount: 0,
        freeListings: 0,
        featuredDiscount: 0,
        prioritySupport: false,
        analytics: false,
        bulkListing: false,
        verifiedBadge: false
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 50 : 500,
      duration: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Ideal for regular car sellers',
      icon: Star,
      color: 'text-blue-600',
      highlighted: true,
      features: [
        'Unlimited car listings',
        '20% discount on listing fees',
        '10% discount on featured listings',
        'Priority customer support',
        'Advanced analytics dashboard',
        'Verified seller badge',
        'Bulk listing tools',
        'Extended 60-day listing duration'
      ],
      benefits: {
        listingDiscount: 20,
        freeListings: 5,
        featuredDiscount: 10,
        prioritySupport: true,
        analytics: true,
        bulkListing: true,
        verifiedBadge: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99 : 990,
      duration: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For dealerships and high-volume sellers',
      icon: Crown,
      color: 'text-purple-600',
      features: [
        'Everything in Pro, plus:',
        '50% discount on all listing fees',
        '25% discount on featured listings',
        '10 free featured listings per month',
        'Dedicated account manager',
        'Custom branding options',
        'API access for inventory management',
        'White-label solutions available',
        'Unlimited listing duration',
        'Advanced fraud protection'
      ],
      benefits: {
        listingDiscount: 50,
        freeListings: 20,
        featuredDiscount: 25,
        prioritySupport: true,
        analytics: true,
        bulkListing: true,
        verifiedBadge: true
      }
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: billingCycle === 'monthly' ? 299 : 2990,
      duration: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Ultimate package for elite sellers',
      icon: Gem,
      color: 'text-yellow-600',
      features: [
        'Everything in Enterprise, plus:',
        '75% discount on all listing fees',
        '50% discount on featured listings',
        'Unlimited free featured listings',
        'VIP concierge service',
        'Exclusive marketing opportunities',
        'Premium placement on homepage',
        'Advanced buyer insights',
        'Custom reporting solutions',
        'Early access to new features',
        'Invitation to exclusive events'
      ],
      benefits: {
        listingDiscount: 75,
        freeListings: 50,
        featuredDiscount: 50,
        prioritySupport: true,
        analytics: true,
        bulkListing: true,
        verifiedBadge: true
      }
    }
  ];

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(planId);
    navigate('/subscription-checkout', { 
      state: { 
        planId,
        billingCycle,
        plan: plans.find(p => p.id === planId)
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = (plan: SubscriptionPlan) => {
    if (billingCycle === 'yearly' && plan.price > 0) {
      const monthlyPrice = plan.price / 12;
      const yearlyMonthlyPrice = plans.find(p => p.id === plan.id)?.price || 0;
      const savings = ((monthlyPrice * 12 - yearlyMonthlyPrice) / (monthlyPrice * 12)) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">
                <span className="text-primary">Car</span>
                <span className="text-secondary">Connect</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock powerful features to sell your cars faster and more efficiently
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-600'}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const savings = calculateSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.highlighted ? 'border-2 border-primary shadow-xl scale-105' : 'border border-gray-200'}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.highlighted ? 'bg-primary/10' : 'bg-gray-100'}`}>
                      <Icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 ml-2">/{plan.duration}</span>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        Save {savings}% with yearly billing
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full ${plan.highlighted ? 'bg-primary' : 'bg-gray-900'}`}
                    size="lg"
                  >
                    {plan.price === 0 ? 'Get Started' : `Subscribe ${formatPrice(plan.price)}/${plan.duration}`}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Compare All Features</CardTitle>
            <CardDescription>
              Detailed comparison of all subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Basic</th>
                    <th className="text-center py-3 px-4">Pro</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                    <th className="text-center py-3 px-4">Platinum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Monthly Listings</td>
                    <td className="text-center py-3 px-4">2</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Listing Fee Discount</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">20%</td>
                    <td className="text-center py-3 px-4">50%</td>
                    <td className="text-center py-3 px-4">75%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Free Featured Listings</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">10/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Priority Support</td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Analytics Dashboard</td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Verified Badge</td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Bulk Listing Tools</td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">API Access</td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
                  <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a contract or commitment?</h4>
                  <p className="text-gray-600">No, all plans are month-to-month. You can cancel anytime without penalties.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What happens if I cancel my subscription?</h4>
                  <p className="text-gray-600">You'll keep access to paid features until the end of your billing period, then revert to the Basic plan.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-600">We accept mobile money (MTN, Vodafone, AirtelTigo), credit/debit cards, and bank transfers.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                  <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Are there any hidden fees?</h4>
                  <p className="text-gray-600">No, the price you see is the price you pay. No setup fees or hidden charges.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How do featured listings work?</h4>
                  <p className="text-gray-600">Featured listings get priority placement in search results and special highlighting on the homepage.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What is bulk listing?</h4>
                  <p className="text-gray-600">Bulk listing tools allow you to upload multiple cars at once using spreadsheets or API integration.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What analytics are included?</h4>
                  <p className="text-gray-600">Track views, inquiries, conversion rates, and buyer demographics for all your listings.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
