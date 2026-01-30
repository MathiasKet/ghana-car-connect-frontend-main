import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Calculator, FileCheck, TrendingUp, Clock } from "lucide-react";

const CarFinancing = () => {
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
              <DollarSign className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Car Financing Solutions</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Flexible car financing options to help you drive your dream car without financial stress. 
                Competitive rates and quick approval process.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">New Car Loans</h3>
                  <p className="text-gray-600 text-sm mb-4">Financing for brand new vehicles</p>
                  <p className="text-xl font-bold text-green-600">From 8% APR</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Used Car Loans</h3>
                  <p className="text-gray-600 text-sm mb-4">Affordable options for pre-owned cars</p>
                  <p className="text-xl font-bold text-blue-600">From 12% APR</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg text-center">
                  <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quick Approval</h3>
                  <p className="text-gray-600 text-sm mb-4">Get approved in 24 hours</p>
                  <p className="text-xl font-bold text-purple-600">Fast Process</p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Loan Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <FileCheck className="w-5 h-5 text-primary mr-2" />
                      Flexible Terms
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Loan duration: 12-72 months</li>
                      <li>• Down payment: 10-30%</li>
                      <li>• Competitive interest rates</li>
                      <li>• No hidden fees</li>
                      <li>• Early repayment options</li>
                    </ul>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 text-primary mr-2" />
                      Financial Benefits
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Fixed monthly payments</li>
                      <li>• No prepayment penalties</li>
                      <li>• Tax benefits available</li>
                      <li>• Insurance included</li>
                      <li>• Road tax coverage</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Eligibility Requirements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">For Individuals</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Age: 21-65 years</li>
                      <li>• Minimum income: ₵2,000/month</li>
                      <li>• Valid Ghanaian ID</li>
                      <li>• 6 months bank statements</li>
                      <li>• Proof of residence</li>
                      <li>• Good credit history</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-4">For Businesses</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Registered business entity</li>
                      <li>• 2 years in operation</li>
                      <li>• Annual turnover: ₵100,000+</li>
                      <li>• Business registration documents</li>
                      <li>• Financial statements</li>
                      <li>• Tax clearance certificate</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">Application Process</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Submit Application</h4>
                      <p className="text-gray-600">Fill out our online application form with your details and vehicle choice.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Document Verification</h4>
                      <p className="text-gray-600">Upload required documents for identity and income verification.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Credit Assessment</h4>
                      <p className="text-gray-600">Our team reviews your application and performs a credit check.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Loan Approval</h4>
                      <p className="text-gray-600">Receive approval within 24 hours with loan terms and conditions.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-primary bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold">Vehicle Purchase</h4>
                      <p className="text-gray-600">Complete the vehicle purchase and drive away in your new car.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Loan Calculator</h2>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Vehicle Price (₵)</label>
                      <input type="number" className="w-full p-2 border rounded" placeholder="50000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Down Payment (%)</label>
                      <input type="number" className="w-full p-2 border rounded" placeholder="20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Loan Term (months)</label>
                      <select className="w-full p-2 border rounded">
                        <option>12</option>
                        <option>24</option>
                        <option>36</option>
                        <option>48</option>
                        <option>60</option>
                        <option>72</option>
                      </select>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">
                    Calculate Monthly Payment
                  </button>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Finance Team</h2>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-gray-600">Phone: +233 30 234 5678</p>
                  <p className="text-gray-600">Email: finance@carconnectghana.com</p>
                  <p className="text-gray-600">Office Hours: Mon-Fri, 8am-6pm</p>
                  <p className="text-gray-600">WhatsApp: +233 59 181 8492</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFinancing;
