import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabaseService from '@/services/supabaseService';
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
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Settings
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);

      const filters: any = {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
        make: selectedBrand,
        body_type: selectedType.toLowerCase(),
        listing_type: 'sell'
      };

      // Handle price range filter
      if (selectedPrice === 'under-100k') {
        filters.max_price = 100000;
      } else if (selectedPrice === '100k-150k') {
        filters.min_price = 100000;
        filters.max_price = 150000;
      } else if (selectedPrice === 'over-150k') {
        filters.min_price = 150000;
      }

      const result = await supabaseService.getCarListings(filters);

      const formattedCars = result.data.map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        price: car.price,
        image: (car.images && car.images.length > 0) ? car.images[0] : '/placeholder.svg',
        year: car.year,
        mileage: `${car.mileage} km`,
        fuel: car.fuel_type,
        transmission: car.transmission,
        location: car.location,
        type: car.type,
        brand: car.make
      }));

      setCars(formattedCars);
      setTotalCars(result.count);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedBrand, selectedPrice, selectedType]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Read search params from URL on mount
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');
    const makeParam = searchParams.get('make');

    if (locationParam) setSearchTerm(locationParam);
    if (typeParam) {
      const type = typeParam.charAt(0).toUpperCase() + typeParam.slice(1).toLowerCase();
      setSelectedType(type);
    }
    if (makeParam) {
      const make = makeParam.charAt(0).toUpperCase() + makeParam.slice(1).toLowerCase();
      setSelectedBrand(make);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedPrice, selectedType]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Buy a Car</h1>
              <p className="text-gray-600">Find your perfect vehicle from our extensive collection in Ghana</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Search and Filters */}
        <Card className="mb-8 overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search make or model..."
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
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  <SelectItem value="Kia">Kia</SelectItem>
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
                  <SelectItem value="Pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'Searching...' : `Showing ${cars.length} of ${totalCars} cars`}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px] h-8 text-sm border-none bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Finding the best cars for you...</p>
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <Card
                  key={car.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-sm cursor-pointer"
                  onClick={() => navigate(`/car/${car.id}`)}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-black hover:bg-white border-none backdrop-blur-sm">
                        {car.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{car.name}</h3>
                    </div>

                    <div className="mb-4 text-2xl font-black text-primary">
                      GHS {car.price.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {car.year}
                      </div>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                        {car.mileage}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                        {car.fuel}
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-gray-400" />
                        {car.transmission}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {car.location}
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary font-bold hover:bg-primary/10">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12 pb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-full ${currentPage === i + 1 ? 'shadow-md shadow-primary/20' : ''}`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              We couldn't find any cars matching your current search or filters. Try adjusting them.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedBrand('');
              setSelectedPrice('');
              setSelectedType('');
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;
