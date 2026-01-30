import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Upload, 
  X, 
  Plus, 
  CreditCard, 
  ArrowLeft,
  Camera,
  DollarSign,
  Settings,
  Info,
  Crown,
  CheckCircle2,
  Star
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface CarFormData {
  // Basic Information
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  transmission: string;
  fuelType: string;
  
  // Pricing
  price: string;
  negotiable: boolean;
  
  // Details
  description: string;
  features: string[];
  
  // Location
  location: string;
  
  // Images
  images: string[];
  
  // Payment
  paymentMethod: string;
  featuredListing: boolean;
}

const ListCar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [formData, setFormData] = useState<CarFormData>({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    transmission: '',
    fuelType: '',
    price: '',
    negotiable: false,
    description: '',
    features: [],
    location: '',
    images: [],
    paymentMethod: '',
    featuredListing: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Mock subscription data - in real app, this would come from user data
      const mockSubscription = {
        plan: 'pro',
        status: 'active',
        benefits: {
          listingDiscount: 20,
          freeListings: 5,
          featuredDiscount: 10,
          prioritySupport: true,
          analytics: true,
          bulkListing: true,
          verifiedBadge: true
        }
      };
      
      setSubscription(mockSubscription);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Calculate pricing based on subscription benefits
  const calculatePricing = () => {
    const standardPrice = 50;
    const featuredPrice = 150;
    
    let listingPrice = standardPrice;
    let featuredPriceFinal = featuredPrice;
    
    if (subscription && subscription.status === 'active') {
      // Apply subscription discounts
      listingPrice = Math.round(standardPrice * (1 - subscription.benefits.listingDiscount / 100));
      featuredPriceFinal = Math.round(featuredPrice * (1 - subscription.benefits.featuredDiscount / 100));
    }
    
    return {
      standard: listingPrice,
      featured: featuredPriceFinal,
      savings: subscription ? standardPrice - listingPrice : 0
    };
  };

  const pricing = calculatePricing();

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const carMakes = [
    'Toyota', 'Honda', 'Nissan', 'Mitsubishi', 'Mazda', 'Suzuki',
    'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet'
  ];

  const availableFeatures = [
    'Air Conditioning', 'Power Steering', 'Power Windows', 'Central Locking',
    'Anti-lock Braking System (ABS)', 'Airbags', 'Alloy Wheels', 'Sunroof',
    'Leather Seats', 'GPS Navigation', 'Bluetooth', 'Cruise Control',
    'Parking Sensors', 'Reverse Camera', 'Keyless Entry', 'Push Start'
  ];

  const handleImageUpload = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock listing creation
      console.log('Car listing created:', formData);
      
      // Calculate final amount based on subscription benefits
      const finalAmount = formData.featuredListing ? pricing.featured : pricing.standard;
      
      // Navigate to payment page
      navigate('/payment', { 
        state: { 
          listingData: formData,
          amount: finalAmount,
          description: `Car listing fee - ${formData.make} ${formData.model}`,
          subscriptionBenefits: subscription && subscription.status === 'active' ? {
            originalPrice: formData.featuredListing ? 150 : 50,
            discountedPrice: finalAmount,
            savings: pricing.savings
          } : null
        }
      });
    } catch (err) {
      setError('Failed to create listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, make: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="e.g. Camry, Civic, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, year: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="mileage">Mileage (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="e.g. 45000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs-repair">Needs Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="transmission">Transmission *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, transmission: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pricing & Location</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (GHS) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g. 85000"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="negotiable"
                    checked={formData.negotiable}
                    onCheckedChange={(checked) => setFormData({...formData, negotiable: checked as boolean})}
                  />
                  <Label htmlFor="negotiable">Price is negotiable</Label>
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accra">Accra</SelectItem>
                      <SelectItem value="kumasi">Kumasi</SelectItem>
                      <SelectItem value="tamale">Tamale</SelectItem>
                      <SelectItem value="takoradi">Takoradi</SelectItem>
                      <SelectItem value="cape-coast">Cape Coast</SelectItem>
                      <SelectItem value="tema">Tema</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              <div className="space-y-4">
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImageUpload}
                  maxImages={10}
                  maxSize={5}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Description & Features</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your car's condition, maintenance history, special features, etc."
                  />
                </div>
                
                <div>
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {availableFeatures.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Subscription Benefits Alert */}
                {subscription && subscription.status === 'active' && (
                  <Alert className="bg-green-50 border-green-200">
                    <Crown className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Subscription Benefits Active!</strong> You're saving {pricing.savings > 0 && `${pricing.savings}%`} on listing fees with your {subscription.plan} plan.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">Standard Listing</h4>
                        {subscription && subscription.status === 'active' && (
                          <Badge className="bg-green-100 text-green-800">
                            {subscription.benefits.listingDiscount}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Your car will be listed for 30 days</p>
                      {subscription && subscription.status === 'active' && subscription.benefits.freeListings > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {subscription.benefits.freeListings} free listings included this month
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div>
                        {pricing.savings > 0 && (
                          <p className="text-sm text-gray-500 line-through">GHS 50</p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {pricing.standard === 0 ? 'FREE' : `GHS ${pricing.standard}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="featured"
                        checked={formData.featuredListing}
                        onCheckedChange={(checked) => setFormData({...formData, featuredListing: checked as boolean})}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">Featured Listing</h4>
                          {subscription && subscription.status === 'active' && (
                            <Badge className="bg-green-100 text-green-800">
                              {subscription.benefits.featuredDiscount}% OFF
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Get priority placement and more visibility</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>
                        {subscription && subscription.status === 'active' && (
                          <p className="text-sm text-gray-500 line-through">GHS 150</p>
                        )}
                        <p className="text-lg font-bold text-blue-600">
                          GHS {pricing.featured}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {subscription && subscription.status === 'active' && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Total Savings:</strong> GHS {pricing.savings} on this listing
                      </p>
                      <Link to="/subscription" className="text-primary text-sm hover:underline mt-2 inline-block">
                        View subscription details →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Car className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">List Your Car</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Pricing & Location'}
                {currentStep === 3 && 'Photos'}
                {currentStep === 4 && 'Description & Features'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Tell us about your car\'s basic details'}
                {currentStep === 2 && 'Set your price and location'}
                {currentStep === 3 && 'Add photos to showcase your car'}
                {currentStep === 4 && 'Describe your car and select features'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  {currentStep === totalSteps ? (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListCar;
