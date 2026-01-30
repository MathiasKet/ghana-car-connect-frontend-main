import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  Users, 
  Shield, 
  CheckCircle2,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  Info,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface DealerPlan {
  id: string;
  name: string;
  price: number;
  setupFee: number;
  description: string;
  features: string[];
  icon: any;
  highlighted?: boolean;
  listingsLimit: string;
  supportLevel: string;
}

const DealerAccount = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });
  const [documents, setDocuments] = useState({
    businessRegistration: false,
    taxClearance: false,
    idDocument: false,
    proofOfAddress: false
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dealerPlans: DealerPlan[] = [
    {
      id: 'starter',
      name: 'Starter Dealer',
      price: 199,
      setupFee: 500,
      description: 'Perfect for small dealerships and individual sellers',
      icon: Building,
      features: [
        'Up to 50 active listings',
        'Basic dealer profile',
        'Standard customer support',
        'Monthly analytics report',
        'Basic inventory management',
        'Email support',
        'CarConnect branding',
        'Standard payment processing'
      ],
      listingsLimit: '50',
      supportLevel: 'Standard'
    },
    {
      id: 'professional',
      name: 'Professional Dealer',
      price: 499,
      setupFee: 1000,
      description: 'Ideal for established dealerships',
      icon: Star,
      highlighted: true,
      features: [
        'Up to 200 active listings',
        'Enhanced dealer profile',
        'Priority customer support',
        'Real-time analytics dashboard',
        'Advanced inventory management',
        'Phone & email support',
        'Custom branding options',
        'Advanced payment processing',
        'Bulk listing tools',
        'API access',
        'Monthly marketing credits'
      ],
      listingsLimit: '200',
      supportLevel: 'Priority'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Dealer',
      price: 999,
      setupFee: 2000,
      description: 'For large dealerships and automotive groups',
      icon: TrendingUp,
      features: [
        'Unlimited active listings',
        'Premium dealer profile',
        'Dedicated account manager',
        'Advanced analytics & insights',
        'Enterprise inventory system',
        '24/7 dedicated support',
        'Full white-label options',
        'Custom payment solutions',
        'Advanced bulk tools',
        'Full API access',
        'Unlimited marketing credits',
        'Custom integrations',
        'Training & onboarding',
        'Quarterly business reviews'
      ],
      listingsLimit: 'Unlimited',
      supportLevel: 'Dedicated'
    }
  ];

  const selectedDealerPlan = dealerPlans.find(plan => plan.id === selectedPlan);

  const calculateTotalCost = () => {
    const plan = dealerPlans.find(p => p.id === selectedPlan);
    if (!plan) return 0;
    return plan.setupFee + plan.price;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentToggle = (doc: string, checked: boolean) => {
    setDocuments(prev => ({ ...prev, [doc]: checked }));
  };

  const handleSubmit = () => {
    // Validate form
    const requiredFields = ['businessName', 'businessType', 'registrationNumber', 'address', 'city', 'phone', 'email'];
    const isValid = requiredFields.every(field => businessInfo[field as keyof typeof businessInfo]);
    const allDocumentsChecked = Object.values(documents).every(checked => checked);

    if (!isValid || !allDocumentsChecked || !agreedToTerms) {
      alert('Please complete all required fields and agree to the terms');
      return;
    }

    // Navigate to payment
    navigate('/dealer-setup-payment', {
      state: {
        plan: selectedDealerPlan,
        businessInfo,
        documents,
        totalCost: calculateTotalCost()
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
              <h1 className="text-3xl font-bold">Dealer Account Setup</h1>
              <p className="text-gray-600">Join our premium dealer network and grow your business</p>
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
          <h2 className="text-2xl font-bold mb-4">Become a Verified CarConnect Dealer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get access to premium tools, dedicated support, and enhanced visibility for your dealership
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Choose Your Dealer Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dealerPlans.map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = selectedPlan === plan.id;
                    
                    return (
                      <div 
                        key={plan.id}
                        className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        } ${plan.highlighted ? 'ring-2 ring-primary/20' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.highlighted && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-white px-3 py-1">
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${plan.highlighted ? 'bg-primary/10' : 'bg-gray-100'}`}>
                              <Icon className={`h-6 w-6 ${plan.highlighted ? 'text-primary' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                              </div>
                              <p className="text-gray-600 mb-3">{plan.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500">Listings Limit</p>
                                  <p className="font-semibold">{plan.listingsLimit}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Support Level</p>
                                  <p className="font-semibold">{plan.supportLevel}</p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Setup Fee (one-time)</span>
                                  <span className="font-bold">{formatPrice(plan.setupFee)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Monthly Fee</span>
                                  <span className="font-bold text-primary">{formatPrice(plan.price)}/month</span>
                                </div>
                              </div>

                              <ul className="space-y-1">
                                {plan.features.slice(0, 4).map((feature, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-sm">
                                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                                {plan.features.length > 4 && (
                                  <p className="text-xs text-gray-500">+{plan.features.length - 4} more features</p>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select value={businessInfo.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dealership">Car Dealership</SelectItem>
                        <SelectItem value="rental">Car Rental Company</SelectItem>
                        <SelectItem value="broker">Car Broker</SelectItem>
                        <SelectItem value="individual">Individual Seller</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="registrationNumber">Business Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={businessInfo.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="Enter registration number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    value={businessInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={businessInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={businessInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={businessInfo.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={businessInfo.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your business..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All documents are required for verification. Please have digital copies ready to upload.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox 
                      id="businessRegistration"
                      checked={documents.businessRegistration}
                      onCheckedChange={(checked) => handleDocumentToggle('businessRegistration', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="businessRegistration" className="font-medium cursor-pointer">
                        Business Registration Certificate
                      </Label>
                      <p className="text-sm text-gray-600">Official business registration document</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox 
                      id="taxClearance"
                      checked={documents.taxClearance}
                      onCheckedChange={(checked) => handleDocumentToggle('taxClearance', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="taxClearance" className="font-medium cursor-pointer">
                        Tax Clearance Certificate
                      </Label>
                      <p className="text-sm text-gray-600">Up-to-date tax clearance certificate</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox 
                      id="idDocument"
                      checked={documents.idDocument}
                      onCheckedChange={(checked) => handleDocumentToggle('idDocument', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="idDocument" className="font-medium cursor-pointer">
                        Director/Owner ID Document
                      </Label>
                      <p className="text-sm text-gray-600">Valid ID of business owner or director</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox 
                      id="proofOfAddress"
                      checked={documents.proofOfAddress}
                      onCheckedChange={(checked) => handleDocumentToggle('proofOfAddress', checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="proofOfAddress" className="font-medium cursor-pointer">
                        Proof of Address
                      </Label>
                      <p className="text-sm text-gray-600">Utility bill or bank statement (last 3 months)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Setup Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Selected Plan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium">{selectedDealerPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listings Limit</span>
                      <span className="font-medium">{selectedDealerPlan?.listingsLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Support</span>
                      <span className="font-medium">{selectedDealerPlan?.supportLevel}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Setup Fee (one-time)</span>
                      <span>{formatPrice(selectedDealerPlan?.setupFee || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Month Fee</span>
                      <span>{formatPrice(selectedDealerPlan?.price || 0)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Setup Cost</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(calculateTotalCost())}
                  </span>
                </div>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    After setup, you'll be billed {formatPrice(selectedDealerPlan?.price || 0)} monthly.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Dealer Terms and Conditions
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                >
                  Complete Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Setup typically takes 2-3 business days after document verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerAccount;
