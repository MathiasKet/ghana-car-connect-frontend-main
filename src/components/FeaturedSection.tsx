
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MapPin, Calendar, Fuel, Settings } from 'lucide-react';
import { useAdminContent } from '@/hooks/useAdminContent';

const FeaturedSection = () => {
  const [category, setCategory] = useState('buy');
  const { featuredCars, loading } = useAdminContent();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(category === 'buy' ? '/buy' : '/rent');
  };

  const filteredCars = featuredCars.filter(car => 
    car.featured && car.category === category
  );

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const CarCard = ({ car }: { car: any }) => (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/car/${car.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={car.imageUrl} 
            alt={`${car.make} ${car.model}`}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-2 left-2">
            {car.category === 'buy' ? 'For Sale' : 'For Rent'}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{car.make} {car.model}</h3>
          <p className="text-sm text-gray-600 mb-2">{car.year} • {car.transmission}</p>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{car.location}</span>
          </div>
          
          <div className="text-lg font-bold text-primary mb-3">
            {car.category === 'buy' ? (
              <span>GHS {car.price.toLocaleString()}</span>
            ) : (
              <span>GHS {car.rentalPrice}/day</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {car.condition}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.fuelType}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {car.mileage.toLocaleString()} km
            </Badge>
          </div>
          
          {car.category === 'rent' && (
            <Badge variant={car.available ? 'default' : 'destructive'} className="mb-3">
              {car.available ? 'Available' : 'Unavailable'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Featured Vehicles</h2>
            <p className="text-muted-foreground">Explore our top picks for buying and renting in Ghana</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Tabs value={category} onValueChange={setCategory} className="w-[320px]">
              <TabsList>
                <TabsTrigger value="buy" className="flex-1">For Sale</TabsTrigger>
                <TabsTrigger value="rent" className="flex-1">For Rent</TabsTrigger>
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
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No featured {category === 'buy' ? 'cars for sale' : 'rental cars'} available.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" className="gap-2" onClick={handleViewAll}>
            View All Vehicles <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
