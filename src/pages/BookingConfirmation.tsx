import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Car, Calendar, MapPin, Users, ArrowLeft, Phone, Mail } from 'lucide-react';

interface BookingDetails {
  car: any;
  bookingData: any;
  totalPrice: number;
  bookingId: string;
}

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state as BookingDetails;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Booking Found</h2>
          <Button onClick={() => navigate('/rent')}>
            Back to Rentals
          </Button>
        </div>
      </div>
    );
  }

  const { car, bookingData, totalPrice, bookingId } = booking;

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
                <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                <p className="text-gray-600">Your rental car has been successfully booked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Booking Successful!</h2>
                  <p className="text-green-700">
                    Your booking reference is <span className="font-mono font-bold">{bookingId}</span>
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    A confirmation email has been sent to {bookingData.driverEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="font-semibold">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-semibold text-lg text-primary">GHS {totalPrice}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Rental Period
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pickup:</span>
                      <span className="font-medium">
                        {new Date(bookingData.pickupDate).toLocaleDateString()} at {bookingData.pickupTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span className="font-medium">
                        {new Date(bookingData.returnDate).toLocaleDateString()} at {bookingData.returnTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Locations
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pickup:</span>
                      <span className="font-medium">{bookingData.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return:</span>
                      <span className="font-medium">{bookingData.returnLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Additional Services</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span className="font-medium capitalize">{bookingData.insurance}</span>
                    </div>
                    {bookingData.additionalDriver && (
                      <div className="flex justify-between">
                        <span>Additional Driver:</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
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
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{bookingData.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{bookingData.driverEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{bookingData.driverPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License:</span>
                    <span className="font-medium">{bookingData.driverLicense}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Important Information</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Please arrive 30 minutes before pickup time</li>
                    <li>• Bring valid driver's license and ID</li>
                    <li>• Payment method: {bookingData.paymentMethod}</li>
                    <li>• Free cancellation up to 24 hours before pickup</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              onClick={() => navigate('/rent')}
              className="flex-1"
            >
              Book Another Car
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex-1"
            >
              Print Confirmation
            </Button>
          </div>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">+233 59 181 8492</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@carconnectghana.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
