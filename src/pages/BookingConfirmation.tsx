import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  CheckCircle2,
  Car,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import Footer from '@/components/Footer';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state as any;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Booking Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find any recent booking data. Please try again or contact support.</p>
          <Button onClick={() => navigate('/')} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isInspection = booking.type === 'inspection';
  const { car, bookingId, totalPrice } = booking;
  const data = isInspection ? booking.booking : booking.bookingData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4 hover:bg-transparent p-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Booking Confirmed!</h1>
                <p className="text-sm md:text-base text-gray-600">
                  {isInspection ? 'Your vehicle inspection has been scheduled' : 'Your rental car has been successfully booked'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8 border-green-200 bg-green-50 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-green-800 capitalize">
                    {isInspection ? `${booking.package?.name} Booked!` : 'Rental Successful!'}
                  </h2>
                  <p className="text-green-700 font-medium">
                    Reference: <span className="font-mono bg-white px-2 py-0.5 rounded border border-green-200 ml-1">{bookingId || 'CC-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    A confirmation {isInspection ? 'SMS and email' : 'email'} has been sent to {isInspection ? data?.contactEmail : data?.driverEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-lg">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Status</p>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none">Scheduled</Badge>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Payment</p>
                    <p className="font-bold text-lg text-primary">₵{totalPrice || booking.package?.price || '0'}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {isInspection ? 'Appointment Time' : 'Rental Period'}
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {isInspection ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Scheduled for:</span>
                        <span className="font-bold text-gray-900">
                          {data?.date} at {data?.time || 'flexible'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pickup:</span>
                          <span className="font-medium">
                            {new Date(data?.pickupDate).toLocaleDateString()} at {data?.pickupTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Return:</span>
                          <span className="font-medium">
                            {new Date(data?.returnDate).toLocaleDateString()} at {data?.returnTime}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {isInspection ? 'Inspection Location' : 'Pickup & Return'}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900">
                      {isInspection ? data?.location : `${data?.pickupLocation} to ${data?.returnLocation}`}
                    </p>
                  </div>
                </div>

                {isInspection && booking.package?.features && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 flex items-center text-gray-900 uppercase text-xs tracking-widest">
                      Package Features
                    </h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {booking.package.features.slice(0, 4).map((f: string, i: number) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side Information */}
            <div className="space-y-6">
              <Card className="shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-100 relative group">
                  <img
                    src={car?.images?.[0] || car?.image || '/placeholder.svg'}
                    alt={car?.model}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary hover:bg-white shadow">
                      {car?.make} {car?.model}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Car className="h-4 w-4 mr-2 text-primary/60" />
                      {car?.type || 'Vehicle'}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-2 text-primary/60" />
                      {car?.seats ? `${car.seats} Seats` : car?.year}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-sm uppercase tracking-widest text-gray-500">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 lowercase">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">Name</span>
                    </div>
                    <span className="font-bold">{isInspection ? data?.contactName : data?.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 lowercase">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">Email</span>
                    </div>
                    <span className="font-medium text-sm truncate max-w-[150px]">{isInspection ? data?.contactEmail : data?.driverEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 lowercase">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <span className="font-medium">{isInspection ? data?.contactPhone : data?.driverPhone}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 bg-primary text-white rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full transition-transform group-hover:scale-150" />
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Important Note
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isInspection
                    ? "Our specialist will call you 60 minutes before arrival. Please ensure the vehicle is accessible and keys are available."
                    : "Please bring your original Ghana Card and a valid driver's license for verification at pickup."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-20">
            <Button size="lg" onClick={() => navigate('/')} className="flex-1 shadow-md">
              Back to Home
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()} className="flex-1 border-2">
              Download PDF Receipt
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
