import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CheckCircle2,
    Shield,
    Wrench,
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Car as CarIcon,
    ChevronRight,
    ChevronLeft,
    AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import api from '@/services/api';

const packages = [
    {
        id: 'basic',
        name: 'Basic Inspection',
        price: 150,
        description: 'Essential safety and mechanical checks',
        features: ['50-point inspection', 'Brakes & Tires', 'Fluid levels', 'Basic road test', 'Digital report']
    },
    {
        id: 'comprehensive',
        name: 'Comprehensive',
        price: 300,
        description: 'Complete vehicle health assessment',
        features: ['150-point inspection', 'Diagnostic scanning', 'Body & Paint check', 'Interior evaluation', 'Engine performance', 'Photo documentation']
    },
    {
        id: 'premium',
        name: 'Premium Expert',
        price: 500,
        description: 'The ultimate peace of mind',
        features: ['200-point inspection', 'Advanced diagnostics', 'Paint thickness test', 'Market value assessment', 'Maintenance history review', 'Priority 4-hour delivery']
    }
];

const BookInspection = () => {
    const [searchParams] = useSearchParams();
    const carId = searchParams.get('carId');
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [car, setCar] = useState<any>(null);
    const [selectedPackage, setSelectedPackage] = useState(packages[1]);
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        location: 'Accra',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (carId) {
            loadCar();
        }
    }, [carId]);

    const loadCar = async () => {
        try {
            const data = await api.getCarById(carId!);
            setCar(data);
        } catch (error) {
            console.error('Error loading car:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/booking-confirmation', {
                state: {
                    type: 'inspection',
                    package: selectedPackage,
                    car,
                    booking: bookingData
                }
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Book Vehicle Inspection"
                description="Schedule a professional vehicle inspection in Ghana. Expert technicians, detailed reports, and peace of mind."
            />
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-transparent p-0 flex items-center text-gray-600"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Booking Flow */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Steps Indicator */}
                        <div className="flex items-center space-x-4 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {s}
                                    </div>
                                    {s < 3 && <div className={`w-12 h-1 px-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-gray-900">Choose Inspection Package</h2>
                                <div className="space-y-4">
                                    {packages.map((pkg) => (
                                        <Card
                                            key={pkg.id}
                                            className={`cursor-pointer transition-all border-2 ${selectedPackage.id === pkg.id ? 'border-primary bg-primary/5 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                            onClick={() => setSelectedPackage(pkg)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{pkg.name}</h3>
                                                        <p className="text-gray-600">{pkg.description}</p>
                                                    </div>
                                                    <div className="text-2xl font-bold text-primary">₵{pkg.price}</div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {pkg.features.map((f, i) => (
                                                        <div key={i} className="flex items-center text-sm text-gray-700">
                                                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                                                            {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <Button size="lg" onClick={nextStep}>
                                        Next: Schedule Date
                                        <ChevronRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                <h2 className="text-2xl font-bold text-gray-900">Schedule & Location</h2>
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Select Date</Label>
                                                <Input type="date" name="date" value={bookingData.date} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Preferred Time Slot</Label>
                                                <Input type="time" name="time" value={bookingData.time} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Inspection Location (City/Area)</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        placeholder="e.g. East Legon, Accra"
                                                        name="location"
                                                        value={bookingData.location}
                                                        onChange={handleInputChange}
                                                        className="pl-9"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 italic">Our inspectors can come to the vehicle's location or meet at a designated point.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="flex justify-between">
                                    <Button variant="outline" size="lg" onClick={prevStep}>
                                        <ChevronLeft className="h-5 w-5 mr-2" />
                                        Back
                                    </Button>
                                    <Button size="lg" onClick={nextStep} disabled={!bookingData.date || !bookingData.location}>
                                        Next: Contact Details
                                        <ChevronRight className="h-5 w-5 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                <h2 className="text-2xl font-bold text-gray-900">Your Contact Information</h2>
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input placeholder="John Doe" name="contactName" value={bookingData.contactName} onChange={handleInputChange} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Email Address</Label>
                                                    <Input type="email" placeholder="john@example.com" name="contactEmail" value={bookingData.contactEmail} onChange={handleInputChange} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone Number</Label>
                                                    <Input placeholder="+233 XX XXX XXXX" name="contactPhone" value={bookingData.contactPhone} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-lg flex items-start">
                                            <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-blue-700">
                                                Payment will be collected after the inspection is completed. By booking, you agree to our 24-hour cancellation policy.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="flex justify-between">
                                    <Button variant="outline" size="lg" onClick={prevStep}>
                                        <ChevronLeft className="h-5 w-5 mr-2" />
                                        Back
                                    </Button>
                                    <Button size="lg" className="px-8" onClick={handleSubmit} disabled={loading || !bookingData.contactName || !bookingData.contactPhone}>
                                        {loading ? 'Processing...' : 'Confirm Inspection Booking'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Inspection Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {car && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                            <img src={car.images?.[0] || car.image} alt={car.model} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate">{car.make} {car.model}</p>
                                            <p className="text-xs text-gray-500">{car.year} • ₵{car.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Package:</span>
                                        <span className="font-semibold">{selectedPackage.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Base Price:</span>
                                        <span className="font-bold text-primary">₵{selectedPackage.price}</span>
                                    </div>
                                </div>

                                {bookingData.date && (
                                    <div className="space-y-2 border-t pt-4">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            {bookingData.date}
                                        </div>
                                        {bookingData.time && (
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {bookingData.time}
                                            </div>
                                        )}
                                        <div className="flex items-center text-sm text-gray-700">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {bookingData.location}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="bg-gray-50 flex flex-col items-start pt-4">
                                <div className="flex justify-between w-full mb-4">
                                    <span className="font-bold">Total Estimated:</span>
                                    <span className="font-bold text-xl text-primary">₵{selectedPackage.price}</span>
                                </div>
                                <div className="flex items-center text-[10px] text-gray-500">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Includes traveling within service city.
                                </div>
                            </CardFooter>
                        </Card>

                        <div className="p-6 bg-white border border-dashed rounded-lg border-gray-300">
                            <h4 className="font-semibold mb-2 flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-primary" />
                                Our Promise
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Every inspection is performed by a certified automotive technician with at least 5 years of experience. Reports are delivered digitally within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookInspection;
