import { Link } from "react-router-dom";
import { ArrowLeft, Truck, MapPin, Package, Clock, Shield } from "lucide-react";

const CarTransport = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Truck className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Car Transport Services</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Safe and reliable car transport services across Ghana and beyond. Professional handling 
                of your vehicle with full insurance coverage.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Local Transport</h3>
                  <p className="text-gray-600 text-sm mb-4">Within Ghana cities</p>
                  <p className="text-2xl font-bold text-blue-600">From ₵300</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Long Distance</h3>
                  <p className="text-gray-600 text-sm mb-4">Cross-country transport</p>
                  <p className="text-2xl font-bold text-green-600">From ₵800</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg text-center">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">International</h3>
                  <p className="text-gray-600 text-sm mb-4">West Africa region</p>
                  <p className="text-2xl font-bold text-purple-600">From ₵2,500</p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Transport Services</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Truck className="w-5 h-5 text-primary mr-2" />
                      Open Carrier Transport
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Cost-effective transport using open carriers suitable for standard vehicles.
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Multi-vehicle transport</li>
                      <li>• Economical pricing</li>
                      <li>• Regular departures</li>
                      <li>• Suitable for most vehicles</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Package className="w-5 h-5 text-primary mr-2" />
                      Enclosed Transport
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Premium enclosed transport for luxury, classic, or high-value vehicles.
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Full protection from elements</li>
                      <li>• Enhanced security</li>
                      <li>• Climate-controlled</li>
                      <li>• Ideal for luxury/classic cars</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      Express Transport
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Priority transport service with faster delivery times for urgent needs.
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Expedited delivery</li>
                      <li>• Dedicated transport</li>
                      <li>• Real-time tracking</li>
                      <li>• Priority scheduling</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Service Areas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Major Cities in Ghana</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Accra</p>
                      </div>
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Kumasi</p>
                      </div>
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Takoradi</p>
                      </div>
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Tamale</p>
                      </div>
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Tema</p>
                      </div>
                      <div className="p-2 bg-white rounded text-center">
                        <p className="text-sm font-medium">Cape Coast</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">International Routes</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Ghana to Nigeria</li>
                      <li>• Ghana to Côte d'Ivoire</li>
                      <li>• Ghana to Burkina Faso</li>
                      <li>• Ghana to Togo</li>
                      <li>• Ghana to Benin</li>
                      <li>• Ghana to Mali</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Transport Process</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Book Transport</h4>
                      <p className="text-gray-600">Schedule your transport with pickup and delivery details.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Vehicle Inspection</h4>
                      <p className="text-gray-600">Document vehicle condition before loading for insurance purposes.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Safe Loading</h4>
                      <p className="text-gray-600">Professional loading and securing of your vehicle for transport.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Transit Tracking</h4>
                      <p className="text-gray-600">Monitor your vehicle's journey with real-time tracking updates.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold">Delivery & Inspection</h4>
                      <p className="text-gray-600">Final inspection and delivery at your specified location.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Get Transport Quote</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Pickup Location</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Enter pickup city" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Delivery Location</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Enter delivery city" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Truck</option>
                      <option>Luxury Vehicle</option>
                      <option>Classic Car</option>
                    </select>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Transport Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Open Carrier</option>
                      <option>Enclosed</option>
                      <option>Express</option>
                    </select>
                  </div>
                </div>
                <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                  Get Instant Quote
                </button>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Why Choose Our Transport?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Full Insurance Coverage</h3>
                    <p className="text-gray-600">
                      Comprehensive insurance coverage for your vehicle during transport, 
                      giving you complete peace of mind.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Professional Handling</h3>
                    <p className="text-gray-600">
                      Experienced drivers and handlers ensure your vehicle is transported 
                      safely and securely.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Real-Time Tracking</h3>
                    <p className="text-gray-600">
                      Track your vehicle's journey in real-time with GPS tracking and 
                      regular status updates.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Door-to-Door Service</h3>
                    <p className="text-gray-600">
                      Convenient pickup and delivery at your specified locations for 
                      hassle-free transport.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Transport Team</h2>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-gray-600">Phone: +233 30 345 6789</p>
                  <p className="text-gray-600">Email: transport@carconnectghana.com</p>
                  <p className="text-gray-600">24/7 Hotline: +233 20 987 6543</p>
                  <p className="text-gray-600">Office Hours: Mon-Sat, 7am-8pm</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTransport;
