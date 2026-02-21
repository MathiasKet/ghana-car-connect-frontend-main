import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Zap,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

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
                type: selectedType,
                fuel_type: 'electric' // Always filter by electric
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
                image: (car.images && car.images.length > 0) ? car.images[0] : '/placeholder-car.png',
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

    useEffect(() => {
        // Reset to first page when filters change
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Electric Cars for Sale"
                description="Browse our exclusive collection of electric vehicles in Ghana. Find Tesla, BYD, and more eco-friendly cars."
                keywords="electric cars ghana, EV ghana, tesla ghana, byd ghana, sustainable driving"
            />
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
                            <div className="hidden lg:block relative group">
                                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                                <div className="relative max-w-xl">
                                    <img
                                        src="/electric-hero-car.png"
                                        alt="Modern Electric Vehicle"
                                        className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transform hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            // Fallback if image not found
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement?.parentElement;
                                            if (parent) {
                                                parent.innerHTML = '<div class="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center animate-pulse"><svg class="h-32 w-32 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>';
                                            }
                                        }}
                                    />
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

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">
                            {loading ? 'Searching...' : `Showing ${cars.length} of ${totalCars} electric cars`}
                        </p>
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Finding the best EVs for you...</p>
                        </div>
                    ) : cars.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {cars.map((car) => (
                                    <Card
                                        key={car.id}
                                        className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none group cursor-pointer"
                                        onClick={() => navigate(`/car/${car.id}`)}
                                    >
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
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Electric Cars Matching Your Search</h3>
                            <p className="text-gray-600 mb-8">Try adjusting your filters or search terms.</p>
                            <Button onClick={() => {
                                setSearchTerm('');
                                setSelectedBrand('');
                                setSelectedPrice('');
                                setSelectedType('');
                            }}>Clear All Filters</Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Electric;
