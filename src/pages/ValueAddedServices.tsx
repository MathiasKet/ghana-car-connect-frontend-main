import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Search, 
  FileText, 
  CheckCircle2,
  Star,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  Info
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: any;
  duration: string;
  popular?: boolean;
}

const ValueAddedServices = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'services' | 'checkout'>('services');

  const services: Service[] = [
    {
      id: 'inspection',
      name: 'Professional Inspection',
      price: 300,
      description: 'Comprehensive vehicle inspection by certified mechanics',
      icon: Search,
      duration: '2-3 hours',
      features: [
        '200-point mechanical inspection',
        'Engine performance test',
        'Brake system check',
        'Electrical system diagnosis',
        'Frame and body inspection',
        'Detailed inspection report',
        'Digital photos of issues found',
        'Recommendations for repairs'
      ]
    },
    {
      id: 'photography',
      name: 'Professional Photography',
      price: 200,
      description: 'High-quality photos and videos by professional photographers',
      icon: Camera,
      duration: '1-2 hours',
      popular: true,
      features: [
        '20+ high-resolution photos',
        '360-degree exterior shots',
        'Interior detailed photos',
        'Engine bay photography',
        'Video walkaround (2 minutes)',
        'Professional editing',
        'Optimized for web and mobile',
        'Same-day delivery'
      ]
    },
    {
      id: 'history',
      name: 'Vehicle History Report',
      price: 100,
      description: 'Comprehensive vehicle history and ownership records',
      icon: FileText,
      duration: 'Instant',
      features: [
        'Ownership history',
        'Accident records',
        'Service history',
        'Mileage verification',
        'Theft check',
        'Flood damage check',
        'Title verification',
        'Exportable PDF report'
      ]
    },
    {
      id: 'verification',
      name: 'Verified Seller Badge',
      price: 150,
      description: 'Get verified to build trust with buyers',
      icon: Shield,
      duration: '24-48 hours',
      features: [
        'Identity verification',
        'Address verification',
        'Phone verification',
        'Email verification',
        'Background check',
        'Verified badge on all listings',
        'Priority placement',
        'Increased buyer confidence'
      ]
    },
    {
      id: 'delivery',
      name: 'Vehicle Delivery Service',
      price: 500,
      description: 'Safe and secure vehicle delivery to buyers',
      icon: MapPin,
      duration: '1-3 days',
      features: [
        'Door-to-door delivery',
        'Insured transport',
        'GPS tracking',
        'Professional drivers',
        'Delivery confirmation',
        'Buyer protection',
        'Flexible scheduling',
        'Nationwide coverage'
      ]
    },
    {
      id: 'testdrive',
      name: 'Test Drive Coordination',
      price: 50,
      description: 'Coordinate and manage test drive appointments',
      icon: Clock,
      duration: '1-2 hours',
      features: [
        'Schedule management',
        'Location coordination',
        'Driver verification',
        'Insurance coverage',
        'Route planning',
        'Feedback collection',
        'Follow-up management',
        'Safety protocols'
      ]
    }
  ];

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    if (selectedServices.length === 0) return;
    setCurrentStep('checkout');
  };

  const handlePayment = () => {
    // Navigate to payment page with selected services
    navigate('/services-payment', {
      state: {
        selectedServices: selectedServices.map(id => services.find(s => s.id === id)),
        totalPrice: calculateTotalPrice()
      }
    });
  };

  if (currentStep === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container px-4 py-6 mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Service Checkout</h1>
                <p className="text-gray-600">Review and pay for your selected services</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentStep('services')}>
                Back to Services
              </Button>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Selected Services */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServices.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;
                    const Icon = service.icon;
                    
                    return (
                      <div key={serviceId} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Duration: {service.duration}</span>
                            <span className="font-bold text-primary">{formatPrice(service.price)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Services ({selectedServices.length})</h4>
                    <div className="space-y-2 text-sm">
                      {selectedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return (
                          <div key={serviceId} className="flex justify-between">
                            <span className="text-gray-600">{service?.name}</span>
                            <span>{formatPrice(service?.price || 0)}</span>
                          </div>
                        );
                      })}
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
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Services will be scheduled after payment confirmation.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handlePayment}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Value-Added Services</h1>
              <p className="text-gray-600">Enhance your listing with professional services</p>
            </div>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Sell Your Car Faster with Premium Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our professional services help you present your vehicle in the best light and build trust with potential buyers
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.id);
            
            return (
              <Card 
                key={service.id} 
                className={`relative cursor-pointer transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                }`}
                onClick={() => handleServiceToggle(service.id, !isSelected)}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-3 py-1">
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleServiceToggle(service.id, Boolean(checked))}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-xs text-gray-500">+{service.features.length - 3} more features</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">{formatPrice(service.price)}</span>
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {isSelected ? "Selected" : "Select"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        {selectedServices.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                You've selected {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 mb-4">
                Total: {formatPrice(calculateTotalPrice())}
              </p>
              <Button onClick={handleCheckout} size="lg">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ValueAddedServices;
