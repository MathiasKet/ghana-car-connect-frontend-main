import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Search, CheckCircle, AlertTriangle, Info } from "lucide-react";

const VehicleHistoryReports = () => {
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
              <FileText className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Vehicle History Reports</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Comprehensive vehicle history reports to help you make informed purchasing decisions. 
                Know the complete history of any vehicle before you buy.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Basic Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Essential vehicle information</p>
                  <p className="text-2xl font-bold text-green-600">₵50</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Standard Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete history analysis</p>
                  <p className="text-2xl font-bold text-blue-600">₵100</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg text-center">
                  <Info className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Premium Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Comprehensive with market data</p>
                  <p className="text-2xl font-bold text-purple-600">₵150</p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">What's Included in Our Reports</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Basic Report Features
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Vehicle registration details</li>
                      <li>• Make, model, year information</li>
                      <li>• Engine and transmission details</li>
                      <li>• Color and interior specifications</li>
                      <li>• Registration history</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Search className="w-5 h-5 text-blue-500 mr-2" />
                      Standard Report Features
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• All Basic Report features</li>
                      <li>• Ownership history</li>
                      <li>• Mileage records</li>
                      <li>• Service history</li>
                      <li>• Accident records</li>
                      <li>• Insurance claim history</li>
                      <li>• Theft records</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Info className="w-5 h-5 text-purple-500 mr-2" />
                      Premium Report Features
                    </h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• All Standard Report features</li>
                      <li>• Market value assessment</li>
                      <li>• Depreciation analysis</li>
                      <li>• Comparable sales data</li>
                      <li>• Investment recommendation</li>
                      <li>• Future maintenance predictions</li>
                      <li>• Export certification status</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Red Flag Indicators</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-red-50 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      Warning Signs
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Multiple ownership in short time</li>
                      <li>• Odometer tampering evidence</li>
                      <li>• Major accident history</li>
                      <li>• Salvage or rebuilt title</li>
                      <li>• Water damage history</li>
                      <li>• Fire damage records</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Positive Indicators
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Single owner history</li>
                      <li>• Consistent mileage records</li>
                      <li>• Regular service history</li>
                      <li>• No accident records</li>
                      <li>• Clean title status</li>
                      <li>• Low insurance claims</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Data Sources</h2>
                <p className="text-gray-600 mb-4">
                  Our reports compile information from multiple reliable sources:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Government Records</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• DVLA registration data</li>
                      <li>• Police accident reports</li>
                      <li>• Court records</li>
                      <li>• Import/export documentation</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Industry Partners</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Insurance companies</li>
                      <li>• Service centers</li>
                      <li>• Dealership networks</li>
                      <li>• Financial institutions</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Get Your Vehicle Report</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Vehicle Registration Number</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="e.g., GR-1234-20" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">VIN Number (Optional)</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="17-character VIN" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Basic Report - ₵50</option>
                      <option>Standard Report - ₵100</option>
                      <option>Premium Report - ₵150</option>
                    </select>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Your Email</label>
                    <input type="email" className="w-full p-2 border rounded" placeholder="your@email.com" />
                  </div>
                </div>
                <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                  Generate Report
                </button>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Report Delivery</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Instant Processing</h4>
                      <p className="text-gray-600">Reports are generated instantly upon payment confirmation.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Email Delivery</h4>
                      <p className="text-gray-600">Receive your comprehensive report via email within minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Expert Analysis</h4>
                      <p className="text-gray-600">Premium reports include expert recommendations and insights.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Why Get a History Report?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Avoid Hidden Problems</h3>
                    <p className="text-gray-600">
                      Identify potential issues before purchase, including accident damage, 
                      odometer tampering, or title problems.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Negotiate Better Prices</h3>
                    <p className="text-gray-600">
                      Use the report information to negotiate fair prices based on the 
                      vehicle's true condition and history.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Peace of Mind</h3>
                    <p className="text-gray-600">
                      Drive with confidence knowing the complete history of your vehicle 
                      and making an informed purchase decision.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Resale Value</h3>
                    <p className="text-gray-600">
                      Maintain proper documentation for future resale and demonstrate 
                      transparency to potential buyers.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Report Team</h2>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-gray-600">Phone: +233 30 456 7890</p>
                  <p className="text-gray-600">Email: reports@carconnectghana.com</p>
                  <p className="text-gray-600">Office Hours: Mon-Fri, 8am-6pm</p>
                  <p className="text-gray-600">Emergency: +233 59 181 8492</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryReports;
