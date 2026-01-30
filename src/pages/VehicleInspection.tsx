import { Link } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle, Wrench, FileText, Shield } from "lucide-react";

const VehicleInspection = () => {
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
              <Search className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Vehicle Inspection Service</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Professional vehicle inspection services to ensure you're making a safe and informed purchase decision.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    What We Check
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>Engine performance and condition</li>
                    <li>Transmission and drivetrain</li>
                    <li>Braking system and suspension</li>
                    <li>Electrical systems and wiring</li>
                    <li>Tires and wheel alignment</li>
                    <li>Body condition and accident damage</li>
                    <li>Fluid levels and leaks</li>
                    <li>Emissions and exhaust system</li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    Inspection Benefits
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>Identify hidden problems</li>
                    <li>Negotiate better prices</li>
                    <li>Avoid costly repairs</li>
                    <li>Ensure safety and reliability</li>
                    <li>Professional documentation</li>
                    <li>Peace of mind</li>
                    <li>Insurance requirements</li>
                    <li>Resale value verification</li>
                  </ul>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Wrench className="w-6 h-6 text-primary mr-2" />
                  Inspection Process
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Schedule Inspection</h4>
                      <p className="text-gray-600">Book an inspection at your convenience. We offer flexible scheduling options.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Professional Assessment</h4>
                      <p className="text-gray-600">Our certified technicians perform a comprehensive 150-point inspection.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Detailed Report</h4>
                      <p className="text-gray-600">Receive a comprehensive report with photos and recommendations.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Expert Consultation</h4>
                      <p className="text-gray-600">Review the findings with our experts and make an informed decision.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <FileText className="w-6 h-6 text-primary mr-2" />
                  Inspection Packages
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-3">Basic Inspection</h3>
                    <p className="text-gray-600 mb-4">Essential checks for peace of mind</p>
                    <ul className="text-sm text-gray-600 mb-4 space-y-1">
                      <li>• 50-point inspection</li>
                      <li>• Basic safety checks</li>
                      <li>• Written report</li>
                    </ul>
                    <p className="text-2xl font-bold text-primary">₵150</p>
                  </div>
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow border-primary">
                    <h3 className="text-lg font-semibold mb-3">Comprehensive Inspection</h3>
                    <p className="text-gray-600 mb-4">Complete vehicle assessment</p>
                    <ul className="text-sm text-gray-600 mb-4 space-y-1">
                      <li>• 150-point inspection</li>
                      <li>• Diagnostic testing</li>
                      <li>• Photo documentation</li>
                      <li>• Detailed report</li>
                    </ul>
                    <p className="text-2xl font-bold text-primary">₵300</p>
                  </div>
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-3">Premium Inspection</h3>
                    <p className="text-gray-600 mb-4">Ultimate vehicle evaluation</p>
                    <ul className="text-sm text-gray-600 mb-4 space-y-1">
                      <li>• 200-point inspection</li>
                      <li>• Advanced diagnostics</li>
                      <li>• Video documentation</li>
                      <li>• Market value assessment</li>
                      <li>• Priority service</li>
                    </ul>
                    <p className="text-2xl font-bold text-primary">₵500</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Service Areas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="font-medium">Accra</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="font-medium">Kumasi</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="font-medium">Takoradi</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <p className="font-medium">Tamale</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Book Your Inspection</h2>
                <p className="text-gray-600 mb-6">
                  Ready to get your vehicle inspected? Contact us to schedule an appointment.
                </p>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-gray-600">Phone: +233 59 181 8492</p>
                  <p className="text-gray-600">Email: inspection@carconnectghana.com</p>
                  <p className="text-gray-600">Available: Mon-Sat, 8am-6pm</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInspection;
