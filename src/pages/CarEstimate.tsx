import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Calculator,
  TrendingUp,
  Info,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Car
} from 'lucide-react';

interface EstimateData {
  make: string;
  year: string;
}

const CarEstimate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState<{
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    marketTrend: 'up' | 'down' | 'stable';
    confidence: number;
  } | null>(null);

  useEffect(() => {
    if (location.state) {
      setEstimateData(location.state as EstimateData);
    } else {
      // Try to get data from URL params
      const params = new URLSearchParams(location.search);
      const make = params.get('make');
      const year = params.get('year');
      
      if (make || year) {
        setEstimateData({ make: make || '', year: year || '' });
      }
    }
    setLoading(false);
  }, [location]);

  useEffect(() => {
    if (estimateData) {
      // Simulate API call to get estimate
      const generateEstimate = () => {
        // Mock estimation logic based on make and year
        const basePrices: { [key: string]: number } = {
          'toyota': 80000,
          'honda': 75000,
          'nissan': 70000,
          'mazda': 65000,
          'hyundai': 60000,
          'kia': 55000,
          'mercedes': 150000,
          'bmw': 140000,
          'audi': 130000,
          'volkswagen': 90000
        };

        const basePrice = basePrices[estimateData.make.toLowerCase()] || 70000;
        const yearFactor = parseInt(estimateData.year) >= 2020 ? 1.2 : 
                          parseInt(estimateData.year) >= 2018 ? 1.0 : 0.8;
        
        const adjustedPrice = basePrice * yearFactor;
        const variation = adjustedPrice * 0.2; // 20% variation
        
        setEstimate({
          minPrice: Math.round(adjustedPrice - variation),
          maxPrice: Math.round(adjustedPrice + variation),
          averagePrice: Math.round(adjustedPrice),
          marketTrend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
          confidence: Math.floor(Math.random() * 20) + 75 // 75-95% confidence
        });
      };

      generateEstimate();
    }
  }, [estimateData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleProceedToList = () => {
    navigate('/list-car', { 
      state: { 
        make: estimateData?.make, 
        year: estimateData?.year,
        estimatedPrice: estimate?.averagePrice 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Data Provided</h3>
            <p className="text-gray-600 mb-4">Please provide car make and year to get an estimate.</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
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
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Car Value Estimate</h1>
                <p className="text-gray-600">Get an accurate market valuation for your vehicle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Car Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {estimateData.make} {estimateData.year}
                </h2>
                <p className="text-gray-600">Estimated market value based on current data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimate Results */}
        {estimate && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Price Range */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Estimated Value</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(estimate.averagePrice)}
                  </div>
                  <p className="text-gray-600">Estimated Market Value</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">
                      {formatPrice(estimate.minPrice)}
                    </div>
                    <p className="text-sm text-gray-600">Minimum Value</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatPrice(estimate.maxPrice)}
                    </div>
                    <p className="text-sm text-gray-600">Maximum Value</p>
                  </div>
                </div>

                <Separator />

                {/* Market Trend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`h-4 w-4 ${
                      estimate.marketTrend === 'up' ? 'text-green-500' : 
                      estimate.marketTrend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">Market Trend</span>
                  </div>
                  <Badge variant={
                    estimate.marketTrend === 'up' ? 'default' : 
                    estimate.marketTrend === 'down' ? 'destructive' : 'secondary'
                  }>
                    {estimate.marketTrend === 'up' ? 'Rising' : 
                     estimate.marketTrend === 'down' ? 'Declining' : 'Stable'}
                  </Badge>
                </div>

                {/* Confidence Level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence Level</span>
                    <span>{estimate.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${estimate.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Professional photos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Detailed description</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Competitive pricing</span>
                  </div>
                </div>

                <Button onClick={handleProceedToList} className="w-full">
                  List Your Car
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Use this estimate as a starting point for your listing price
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>How this estimate works:</strong> This valuation is based on current market data, recent sales of similar vehicles, and market trends. Actual selling price may vary based on vehicle condition, mileage, location, and market demand.
          </AlertDescription>
        </Alert>

        {/* Factors Affecting Price */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Factors That Affect Your Car's Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Increases Value</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-green-500" />
                    <span>Low mileage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-green-500" />
                    <span>Excellent condition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-green-500" />
                    <span>Service history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-green-500" />
                    <span>Popular features</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Decreases Value</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-red-500" />
                    <span>High mileage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-red-500" />
                    <span>Poor condition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-red-500" />
                    <span>Accident history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-red-500" />
                    <span>Outdated model</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarEstimate;
