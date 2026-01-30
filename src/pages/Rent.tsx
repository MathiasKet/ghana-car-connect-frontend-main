import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Car,
  Calendar,
  DollarSign,
  Users,
  MapPin
} from 'lucide-react';

interface RentalCar {
  id: string;
  name: string;
  dailyRate: number;
  weeklyRate: number;
  image: string;
  year: number;
  fuel: string;
  transmission: string;
  location: string;
  type: string;
  seats: number;
  available: boolean;
}

const Rent = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchRentalCars = async () => {
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching rental cars:', error);
          return;
        }

        const formattedCars = data.map((car: any) => ({
          id: car.id,
          name: `${car.make} ${car.model}`,
          dailyRate: Math.round(car.price * 0.004), // Estimate daily rental rate
          weeklyRate: Math.round(car.price * 0.025), // Estimate weekly rental rate
          image: car.images[0],
          year: car.year,
          fuel: car.fuel_type,
          transmission: car.transmission,
          location: car.location,
          type: car.type || 'Sedan',
          seats: 5, // Default value, would need to be stored in database
          available: car.status === 'active'
        }));

        setCars(formattedCars || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || car.location === selectedLocation;
    const matchesPrice = !selectedPrice || 
      (selectedPrice === 'under-250' && car.dailyRate < 250) ||
      (selectedPrice === '250-350' && car.dailyRate >= 250 && car.dailyRate <= 350) ||
      (selectedPrice === 'over-350' && car.dailyRate > 350);
    const matchesType = !selectedType || car.type === selectedType;
    
    return matchesSearch && matchesLocation && matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rent a Car</h1>
              <p className="text-gray-600">Find the perfect rental car for your needs</p>
            </div>
            <Button onClick={() => navigate('/')}>
              Back to Main Page
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rental cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Accra">Accra</SelectItem>
                  <SelectItem value="Kumasi">Kumasi</SelectItem>
                  <SelectItem value="Takoradi">Takoradi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice || "all"} onValueChange={(value) => setSelectedPrice(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Daily Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rates</SelectItem>
                  <SelectItem value="under-250">Under GHS 250/day</SelectItem>
                  <SelectItem value="250-350">GHS 250-350/day</SelectItem>
                  <SelectItem value="over-350">Over GHS 350/day</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType || "all"} onValueChange={(value) => setSelectedType(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Car Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">Found {filteredCars.length} rental cars</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="object-cover w-full h-full"
                />
                {!car.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      Not Available
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Available" : "Booked"}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-primary">
                    GHS {car.dailyRate}/day
                  </div>
                  <div className="text-sm text-gray-600">
                    GHS {car.weeklyRate}/week
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {car.year}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {car.seats} Seats
                  </div>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    {car.fuel}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {car.location}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={!car.available}
                  onClick={() => {
                    // Navigate to booking page with car data
                    navigate('/car-booking', { state: car });
                  }}
                >
                  {car.available ? 'Book Now' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rental cars found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rent;
