import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Car, FileText, Phone, CheckCircle } from "lucide-react";

const CarInsurance = () => {
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
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Car Insurance Services</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Comprehensive car insurance solutions tailored to your needs, providing peace of mind on Ghana's roads.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Third Party</h3>
                  <p className="text-gray-600 text-sm mb-4">Basic coverage for legal requirements</p>
                  <p className="text-2xl font-bold text-blue-600">From ₵500/year</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <Car className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Comprehensive</h3>
                  <p className="text-gray-600 text-sm mb-4">Full protection for your vehicle</p>
                  <p className="text-2xl font-bold text-green-600">From ₵1,500/year</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg text-center">
                  <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Premium Plus</h3>
                  <p className="text-gray-600 text-sm mb-4">Enhanced coverage with extras</p>
                  <p className="text-2xl font-bold text-purple-600">From ₵3,000/year</p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Coverage Options</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Third Party Insurance
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Covers damage to other vehicles/property</li>
                      <li>• Injury compensation for third parties</li>
                      <li>• Legal defense costs</li>
                      <li>• Meets Ghana's minimum legal requirements</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Comprehensive Insurance
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• All third party coverage benefits</li>
                      <li>• Damage to your own vehicle</li>
                      <li>• Theft and fire protection</li>
                      <li>• Windshield and glass coverage</li>
                      <li>• Natural disaster protection</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Premium Plus Coverage
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• All comprehensive benefits</li>
                      <li>• 24/7 roadside assistance</li>
                      <li>• Replacement vehicle during repairs</li>
                      <li>• Personal accident coverage</li>
                      <li>• Medical expenses coverage</li>
                      <li>• No-claim bonus protection</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Why Choose Our Insurance?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Quick Claims Process</h3>
                    <p className="text-gray-600">
                      Fast and efficient claims processing with dedicated support representatives 
                      to guide you through every step.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Competitive Rates</h3>
                    <p className="text-gray-600">
                      Affordable premiums with flexible payment options and discounts for 
                      safe drivers and multiple vehicles.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Nationwide Network</h3>
                    <p className="text-gray-600">
                      Access to approved repair shops and service centers across all major 
                      cities in Ghana.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">24/7 Support</h3>
                    <p className="text-gray-600">
                      Round-the-clock customer service for emergencies, claims, and 
                      policy inquiries.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Get a Quote</h2>
                <p className="text-gray-600 mb-6">
                  Provide your vehicle details to get a personalized insurance quote within minutes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Truck</option>
                      <option>Motorcycle</option>
                    </select>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Vehicle Value</label>
                    <select className="w-full p-2 border rounded">
                      <option>Under ₵20,000</option>
                      <option>₵20,000 - ₵50,000</option>
                      <option>₵50,000 - ₵100,000</option>
                      <option>Above ₵100,000</option>
                    </select>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Coverage Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Third Party</option>
                      <option>Comprehensive</option>
                      <option>Premium Plus</option>
                    </select>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Driving Experience</label>
                    <select className="w-full p-2 border rounded">
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>
                </div>
                <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                  Get Instant Quote
                </button>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Insurance Team</h2>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Phone className="w-5 h-5 text-primary mr-2" />
                    <p className="text-gray-600">Hotline: +233 59 181 8492</p>
                  </div>
                  <p className="text-gray-600">Email: insurance@carconnectghana.com</p>
                  <p className="text-gray-600">Office Hours: Mon-Fri, 8am-6pm</p>
                  <p className="text-gray-600">Emergency: 24/7 available</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarInsurance;
