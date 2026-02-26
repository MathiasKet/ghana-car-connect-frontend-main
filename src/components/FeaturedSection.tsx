
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MapPin, Calendar, Fuel, Settings, Loader2 } from 'lucide-react';
import { useAdminContent } from '@/hooks/useAdminContent';
import SupabaseService from '@/services/supabaseService';

const FeaturedSection = () => {
  const [category, setCategory] = useState('buy');
  const [dbCars, setDbCars] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const { featuredCars, loading: adminLoading } = useAdminContent();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setDbLoading(true);
        // Fetch featured cars from Supabase
        const { data } = await SupabaseService.getCarListings({
          featured: true,
          pageSize: 20 // Get more if needed
        });

        if (data) {
          // Map Supabase listings to the format expected by FeaturedSection
          const mappedCars = data.map((car: any) => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            rentalPrice: car.listing_type === 'rent' ? car.price : 0,
            location: car.location,
            mileage: car.mileage,
            transmission: car.transmission,
            fuelType: car.fuel_type, // Map snake_case to camelCase if needed, but let's be flexible
            condition: car.condition,
            description: car.description,
            images: car.images || [],
            featured: car.featured,
            category: car.listing_type === 'sell' ? 'buy' : 'rent',
            available: car.status === 'active'
          }));
          setDbCars(mappedCars);
        }
      } catch (error) {
        console.error('Error fetching featured cars from Supabase:', error);
      } finally {
        setDbLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const handleViewAll = () => {
    navigate(category === 'buy' ? '/buy' : '/rent');
  };

  // Combine localStorage featured cars and Supabase featured cars
  // Deduplicate by ID
  const allFeaturedCars = [...dbCars];

  // Only add localStorage cars if they don't already exist in Supabase list
  featuredCars.forEach(localCar => {
    if (!allFeaturedCars.find(dbCar => dbCar.id === localCar.id)) {
      allFeaturedCars.push(localCar);
    }
  });

  const filteredCars = allFeaturedCars.filter(car =>
    car.featured && car.category === category
  );

  const loading = dbLoading && adminLoading;

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Featured Vehicles</h2>
              <p className="text-muted-foreground">Explore our top picks for buying and renting in Ghana</p>
            </div>
          </div>
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const CarCard = ({ car }: { car: any }) => (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-gray-100"
      onClick={() => navigate(`/car/${car.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={car.images && car.images.length > 0 ? car.images[0] : (car.imageUrl || '/placeholder.svg')}
            alt={`${car.make} ${car.model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm">
            {car.category === 'buy' ? 'For Sale' : 'For Rent'}
          </Badge>
          {car.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-none">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{car.year} • {car.transmission}</p>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>{car.location}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-primary">
              {car.category === 'buy' ? (
                <span>GHS {car.price?.toLocaleString()}</span>
              ) : (
                <span>GHS {car.rentalPrice?.toLocaleString()}/day</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {car.mileage?.toLocaleString()} km
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium bg-gray-50">
              {car.condition}
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium bg-gray-50">
              {car.fuelType}
            </Badge>
            {car.category === 'rent' && (
              <Badge variant={car.available ? 'default' : 'destructive'} className="text-[10px]">
                {car.available ? 'Available' : 'Unavailable'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Featured Vehicles</h2>
            <p className="text-muted-foreground">Explore our top picks for buying and renting in Ghana</p>
          </div>

          <div className="mt-6 md:mt-0">
            <Tabs value={category} onValueChange={setCategory} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">For Sale</TabsTrigger>
                <TabsTrigger value="rent">For Rent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCars.length > 0 ? (
            filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No featured {category === 'buy' ? 'cars for sale' : 'rental cars'} available at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">Check back soon for new listings!</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary hover:text-white transition-all gap-2" onClick={handleViewAll}>
            View All Vehicles <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
