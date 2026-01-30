import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Phone,
  Mail,
  MessageCircle,
  User,
  CheckCircle,
  Star,
  Share2,
  Heart,
  Shield
} from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  rentalPrice?: number;
  category: 'buy' | 'rent';
  condition: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  location: string;
  description: string;
  imageUrl: string;
  images: string[];
  features: string[];
  available?: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    verified: boolean;
    rating: number;
    totalListings: number;
    memberSince: string;
    responseTime: string;
  };
}

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    // Simulate fetching car details
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        // Fetch real car data from Supabase
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching car details:', error);
          setError('Failed to load car details');
          return;
        }

        if (data) {
          // Transform the data to match the Car interface
          const car: Car = {
            id: data.id,
            make: data.make,
            model: data.model,
            year: data.year,
            price: Number(data.price),
            rentalPrice: data.price * 0.004, // Estimate rental price
            category: 'buy',
            condition: data.condition || 'Good',
            fuelType: data.fuel_type || 'Petrol',
            transmission: data.transmission || 'Automatic',
            mileage: data.mileage || 0,
            location: data.location || '',
            description: data.description || '',
            imageUrl: data.images?.[0] || '/placeholder.svg',
            images: data.images || ['/placeholder.svg'],
            features: [], // Features would need to be stored separately
            available: data.status === 'active',
            owner: {
              id: data.user_id,
              name: 'Seller', // Would need to fetch from users table
              email: 'seller@example.com',
              phone: '+233 24 123 4567',
              verified: true,
              rating: 4.8,
              totalListings: 12,
              memberSince: '2022',
              responseTime: 'Within 1 hour'
            }
          };
          setCar(car);
        } else {
          setError('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Simulate sending message
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowMessageForm(false);
      setMessage('');
    }, 2000);
  };

  const handleContactOwner = (method: 'phone' | 'email') => {
    if (method === 'phone' && car) {
      window.open(`tel:${car.owner.phone}`);
    } else if (method === 'email' && car) {
      window.open(`mailto:${car.owner.email}?subject=Inquiry about ${car?.make} ${car?.model}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car?.make} ${car?.model}`,
        text: `Check out this ${car?.year} ${car?.make} ${car?.model} for ${formatPrice(car?.price || 0)}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Car Not Found</h3>
            <p className="text-gray-600 mb-4">The car you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4">
                    {car.category === 'buy' ? 'For Sale' : 'For Rent'}
                  </Badge>
                  {car.owner.verified && (
                    <Badge className="absolute top-4 right-4 bg-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Listing
                    </Badge>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-2 p-4">
                  {car.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{car.make} {car.model}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.transmission}</span>
                  <span>•</span>
                  <span>{car.fuelType}</span>
                  <span>•</span>
                  <span>{car.mileage.toLocaleString()} km</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-3xl font-bold text-primary">
                  {car.category === 'buy' ? (
                    formatPrice(car.price)
                  ) : (
                    `${formatPrice(car.rentalPrice || 0)}/day`
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{car.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Seller Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{car.owner.name}</h4>
                      {car.owner.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{car.owner.rating}</span>
                      <span>•</span>
                      <span>{car.owner.totalListings} listings</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span>{car.owner.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time</span>
                    <span>{car.owner.responseTime}</span>
                  </div>
                </div>

                <Separator />

                {/* Contact Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowMessageForm(!showMessageForm)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => handleContactOwner('phone')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" onClick={() => handleContactOwner('email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>

                {/* Message Form */}
                {showMessageForm && (
                  <div className="space-y-3 pt-3 border-t">
                    <Textarea
                      placeholder="Hi, I'm interested in this vehicle. Could you provide more information?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || messageSent}
                      className="w-full"
                    >
                      {messageSent ? 'Message Sent!' : 'Send Message'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Safety Tips:</strong> Meet in a public place, inspect the vehicle thoroughly, and never pay before seeing the car.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
