import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar, MapPin, Users, Car, DollarSign, Clock, Shield } from 'lucide-react';

interface CarDetails {
  id: number;
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

const CarBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const car = location.state as CarDetails;

  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupTime: '10:00',
    returnTime: '10:00',
    pickupLocation: car?.location || '',
    returnLocation: car?.location || '',
    driverName: '',
    driverEmail: '',
    driverPhone: '',
    driverLicense: '',
    additionalDriver: false,
    insurance: 'basic',
    paymentMethod: '',
    agreeTerms: false
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Car Selected</h2>
          <Button onClick={() => navigate('/rent')}>
            Back to Rentals
          </Button>
        </div>
      </div>
    );
  }

  const calculateDays = (): number => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;
    const pickup = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculatePrice = (): number => {
    const days = calculateDays();
    const basePrice = days >= 7 ? car.weeklyRate * Math.ceil(days / 7) : car.dailyRate * days;
    
    let insuranceCost = 0;
    if (bookingData.insurance === 'premium') insuranceCost = 50 * days;
    else if (bookingData.insurance === 'comprehensive') insuranceCost = 30 * days;
    
    const additionalDriverCost = bookingData.additionalDriver ? 20 * days : 0;
    
    return basePrice + insuranceCost + additionalDriverCost;
  };

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Recalculate price when relevant fields change
    if (['pickupDate', 'returnDate', 'insurance', 'additionalDriver'].includes(field)) {
      setCalculatedPrice(calculatePrice());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      // Process booking
      console.log('Booking submitted:', { car, bookingData, totalPrice: calculatedPrice });
      // Navigate to confirmation page
      navigate('/booking-confirmation', { 
        state: { 
          car, 
          bookingData, 
          totalPrice: calculatedPrice,
          bookingId: 'BK' + Date.now()
        } 
      });
    }
  };

  const days = calculateDays();
  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/rent')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Car Booking</h1>
                <p className="text-gray-600">Complete your rental booking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Step {bookingStep} of 2</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(bookingStep / 2) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {bookingStep === 1 ? 'Rental Details' : 'Driver Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {bookingStep === 1 ? (
                    // Step 1: Rental Details
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickupDate">Pickup Date</Label>
                          <Input
                            id="pickupDate"
                            type="date"
                            value={bookingData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="returnDate">Return Date</Label>
                          <Input
                            id="returnDate"
                            type="date"
                            value={bookingData.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                            required
                            min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickupTime">Pickup Time</Label>
                          <Select value={bookingData.pickupTime} onValueChange={(value) => handleInputChange('pickupTime', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00">8:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="returnTime">Return Time</Label>
                          <Select value={bookingData.returnTime} onValueChange={(value) => handleInputChange('returnTime', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00">8:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickupLocation">Pickup Location</Label>
                          <Select value={bookingData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Accra">Accra</SelectItem>
                              <SelectItem value="Kumasi">Kumasi</SelectItem>
                              <SelectItem value="Takoradi">Takoradi</SelectItem>
                              <SelectItem value="Tema">Tema</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="returnLocation">Return Location</Label>
                          <Select value={bookingData.returnLocation} onValueChange={(value) => handleInputChange('returnLocation', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Accra">Accra</SelectItem>
                              <SelectItem value="Kumasi">Kumasi</SelectItem>
                              <SelectItem value="Takoradi">Takoradi</SelectItem>
                              <SelectItem value="Tema">Tema</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="insurance">Insurance Coverage</Label>
                        <Select value={bookingData.insurance} onValueChange={(value) => handleInputChange('insurance', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Coverage - Included</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive - GHS 30/day</SelectItem>
                            <SelectItem value="premium">Premium Coverage - GHS 50/day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="additionalDriver"
                          checked={bookingData.additionalDriver}
                          onCheckedChange={(checked) => handleInputChange('additionalDriver', checked)}
                        />
                        <Label htmlFor="additionalDriver">Add additional driver (GHS 20/day)</Label>
                      </div>
                    </>
                  ) : (
                    // Step 2: Driver Information
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="driverName">Full Name</Label>
                          <Input
                            id="driverName"
                            value={bookingData.driverName}
                            onChange={(e) => handleInputChange('driverName', e.target.value)}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="driverEmail">Email Address</Label>
                          <Input
                            id="driverEmail"
                            type="email"
                            value={bookingData.driverEmail}
                            onChange={(e) => handleInputChange('driverEmail', e.target.value)}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="driverPhone">Phone Number</Label>
                          <Input
                            id="driverPhone"
                            value={bookingData.driverPhone}
                            onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                            placeholder="+233 59 181 8492"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="driverLicense">Driver's License Number</Label>
                          <Input
                            id="driverLicense"
                            value={bookingData.driverLicense}
                            onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                            placeholder="License number"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="mobile">Mobile Money</SelectItem>
                            <SelectItem value="cash">Cash on Pickup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="agreeTerms"
                          checked={bookingData.agreeTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                          required
                        />
                        <Label htmlFor="agreeTerms">
                          I agree to the rental terms and conditions
                        </Label>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    {bookingStep === 2 && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setBookingStep(1)}
                      >
                        Back
                      </Button>
                    )}
                    <Button 
                      type="submit"
                      className={bookingStep === 1 ? "ml-auto" : ""}
                      disabled={
                        bookingStep === 1 
                          ? !bookingData.pickupDate || !bookingData.returnDate
                          : !bookingData.driverName || !bookingData.driverEmail || !bookingData.driverPhone || !bookingData.agreeTerms
                      }
                    >
                      {bookingStep === 1 ? 'Continue to Driver Info' : 'Complete Booking'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Car Summary & Price Calculation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Car Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg relative">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{car.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {car.type}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {car.seats} Seats
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {car.year}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {car.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Rate ({days} {days === 1 ? 'day' : 'days'})</span>
                    <span>GHS {days >= 7 ? car.weeklyRate * Math.ceil(days / 7) : car.dailyRate * days}</span>
                  </div>
                  
                  {bookingData.insurance !== 'basic' && (
                    <div className="flex justify-between">
                      <span>Insurance ({bookingData.insurance})</span>
                      <span>GHS {bookingData.insurance === 'premium' ? 50 * days : 30 * days}</span>
                    </div>
                  )}
                  
                  {bookingData.additionalDriver && (
                    <div className="flex justify-between">
                      <span>Additional Driver</span>
                      <span>GHS {20 * days}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Price</span>
                      <span className="text-primary">GHS {totalPrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-900 mb-1">Booking Protection</p>
                    <p>Your booking is protected with free cancellation up to 24 hours before pickup.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBooking;
