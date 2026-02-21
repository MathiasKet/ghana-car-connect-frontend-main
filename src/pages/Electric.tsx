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
    Users,
    Zap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const Electric = () => {
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
                    .eq('fuel_type', 'electric')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching cars:', error);
                    return;
                }

                const formattedCars = data.map((car: any) => ({
                    id: car.id,
                    name: `${car.make} ${car.model}`,
                    price: car.price,
                    image: (car.images && car.images.length > 0) ? car.images[0] : '/placeholder-car.png',
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-white border-b relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
                    <div className="container px-4 py-12 mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Sustainable Future
                                </div>
                                <h1 className="text-4xl font-bold mb-4">Electric Cars in Ghana</h1>
                                <p className="text-xl text-gray-600 max-w-2xl">
                                    Go green with our selection of premium electric vehicles. Experience the future of driving today.
                                </p>
                            </div>
                            <div className="hidden lg:block">
                                <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                    <Zap className="h-32 w-32 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container px-4 py-8 mx-auto">
                    {/* Search and Filters */}
                    <Card className="mb-8 border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search electric cars..."
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
                                        <SelectItem value="Tesla">Tesla</SelectItem>
                                        <SelectItem value="BYD">BYD</SelectItem>
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
                                        <SelectItem value="Premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">Showing {filteredCars.length} electric cars</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCars.map((car) => (
                            <Card key={car.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none group">
                                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-green-500 hover:bg-green-600">ELECTRIC</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold">{car.name}</h3>
                                        <Badge variant="outline">{car.year}</Badge>
                                    </div>

                                    <div className="mb-4 text-2xl font-black text-primary">
                                        GHS {car.price.toLocaleString()}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Zap className="h-4 w-4 mr-2 text-green-500" />
                                            Zero Emission
                                        </div>
                                        <div className="flex items-center">
                                            <Car className="h-4 w-4 mr-2 text-blue-500" />
                                            {car.mileage}
                                        </div>
                                        <div className="flex items-center col-span-2">
                                            <Users className="h-4 w-4 mr-2 text-purple-500" />
                                            Automatic Transmission
                                        </div>
                                    </div>

                                    <Button className="w-full group-hover:bg-primary/90">
                                        View Vehicle Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredCars.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Electric Cars Currently Listed</h3>
                            <p className="text-gray-600 mb-8">Be the first to list an EV on CarConnect Ghana!</p>
                            <Button onClick={() => navigate('/list-car')}>List Your Electric Car</Button>
                        </div>
                    )}

                    {loading && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-white animate-pulse rounded-2xl shadow-sm" />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Electric;
