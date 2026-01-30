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
  Filter,
  Car,
  Calendar,
  DollarSign,
  Fuel,
  Users
} from 'lucide-react';

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
  year: number;
  mileage: string;
  fuel: string;
  transmission: string;
  location: string;
  type: string;
  brand: string;
}

const Buy = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching cars:', error);
          return;
        }

        const formattedCars = data.map((car: any) => ({
          id: car.id,
          name: `${car.make} ${car.model}`,
          price: car.price,
          image: car.images[0],
          year: car.year,
          mileage: `${car.mileage} km`,
          fuel: car.fuel_type,
          transmission: car.transmission,
          location: car.location,
          type: car.type,
          brand: car.make
        }));

        setCars(formattedCars || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesPrice = !selectedPrice || 
      (selectedPrice === 'under-100k' && car.price < 100000) ||
      (selectedPrice === '100k-150k' && car.price >= 100000 && car.price <= 150000) ||
      (selectedPrice === 'over-150k' && car.price > 150000);
    const matchesType = !selectedType || car.type === selectedType;
    
    return matchesSearch && matchesBrand && matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Buy a Car</h1>
              <p className="text-gray-600">Find your perfect vehicle from our extensive collection</p>
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
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedBrand || "all"} onValueChange={(value) => setSelectedBrand(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice || "all"} onValueChange={(value) => setSelectedPrice(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100k">Under GHS 100,000</SelectItem>
                  <SelectItem value="100k-150k">GHS 100,000 - 150,000</SelectItem>
                  <SelectItem value="over-150k">Over GHS 150,000</SelectItem>
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
          <p className="text-gray-600">Found {filteredCars.length} cars</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <Badge variant="secondary">{car.type}</Badge>
                </div>
                
                <div className="mb-3 text-2xl font-bold text-primary">
                  GHS {car.price.toLocaleString()}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {car.year}
                  </div>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-1" />
                    {car.mileage}
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    {car.fuel}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {car.transmission}
                  </div>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  {car.location}
                </div>

                <Button className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;
