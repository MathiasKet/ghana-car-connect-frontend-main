import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  Car, 
  Star, 
  TrendingUp,
  Eye,
  Share2,
  Download,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';

const ListingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listingData, setListingData] = useState<any>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (location.state) {
      setListingData(location.state);
    } else {
      navigate('/dashboard');
    }

    // Countdown timer for auto-redirect
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

  const getListingIcon = (listingType: string) => {
    switch (listingType) {
      case 'basic': return Car;
      case 'standard': return Star;
      case 'featured': return TrendingUp;
      case 'premium': return TrendingUp;
      default: return Car;
    }
  };

  if (!listingData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    </div>;
  }

  const ListingIcon = getListingIcon(listingData.listingOption?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Listing Successful!</h1>
              <p className="text-gray-600">Your car has been successfully listed</p>
            </div>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations! Your Listing is Live
            </h2>
            <p className="text-green-700 mb-4">
              Your {listingData.carData?.brand} {listingData.carData?.model} is now visible to thousands of potential buyers.
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              Listing ID: #CL{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListingIcon className="h-5 w-5 mr-2" />
                  {listingData.listingOption?.name} Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Car Information */}
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Information</h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">
                        {listingData.carData?.brand} {listingData.carData?.model}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {listingData.carData?.year}
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          {listingData.carData?.mileage}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listingData.carData?.location}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {listingData.carData?.transmission}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(parseInt(listingData.carData?.price || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Features */}
                <div>
                  <h3 className="font-semibold mb-3">Listing Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listingData.listingOption?.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Type</span>
                        <span className="font-medium">{listingData.listingOption?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{listingData.listingOption?.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">{listingData.paymentMethod?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid</span>
                        <span className="font-bold text-primary">{formatPrice(listingData.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Listing
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium">Respond to inquiries</p>
                      <p className="text-gray-600">Reply to buyer questions promptly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium">Schedule test drives</p>
                      <p className="text-gray-600">Arrange safe meeting locations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium">Complete the sale</p>
                      <p className="text-gray-600">Use our secure payment system</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto-redirect Alert */}
            <Alert>
              <ArrowRight className="h-4 w-4" />
              <AlertDescription>
                Redirecting to dashboard in {countdown} seconds...
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSuccess;
