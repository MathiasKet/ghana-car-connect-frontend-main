import { Link } from "react-router-dom";
import { ArrowLeft, FileText, AlertCircle, Users, Gavel } from "lucide-react";

const TermsOfService = () => {
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
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using CarConnect Ghana, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">User Responsibilities</h2>
                </div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Not engage in fraudulent or deceptive practices</li>
                  <li>Respect other users and their property</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not post inappropriate or harmful content</li>
                  <li>Use the platform for legitimate automotive transactions only</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Prohibited Activities</h2>
                </div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Posting false or misleading vehicle information</li>
                  <li>Attempting to buy or sell stolen vehicles</li>
                  <li>Using fake identities or stolen credentials</li>
                  <li>Spam or unsolicited communications</li>
                  <li>Interfering with platform operations</li>
                  <li>Violating intellectual property rights</li>
                  <li>Engaging in money laundering or illegal activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Vehicle Listings</h2>
                <p className="text-gray-600 mb-4">
                  Users listing vehicles must:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide accurate vehicle descriptions and photos</li>
                  <li>Disclose known defects or issues</li>
                  <li>Have legal ownership or authority to sell</li>
                  <li>Respond to buyer inquiries promptly</li>
                  <li>Honor agreed-upon transaction terms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Transactions and Payments</h2>
                <p className="text-gray-600 mb-4">
                  Regarding financial transactions:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>CarConnect Ghana facilitates but does not guarantee transactions</li>
                  <li>Payment processing is subject to our payment provider's terms</li>
                  <li>Users are responsible for verifying vehicle condition before purchase</li>
                  <li>Refunds are handled according to our refund policy</li>
                  <li>Service fees are non-refundable unless specified</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Gavel className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Dispute Resolution</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  In case of disputes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Parties should first attempt direct resolution</li>
                  <li>CarConnect Ghana may provide mediation services</li>
                  <li>Legal disputes are subject to Ghanaian law</li>
                  <li>Courts in Accra, Ghana have jurisdiction</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Account Termination</h2>
                <p className="text-gray-600">
                  CarConnect Ghana reserves the right to suspend or terminate accounts that violate 
                  these terms or engage in prohibited activities. Users may terminate their accounts 
                  at any time through their account settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-gray-600">
                  CarConnect Ghana is not responsible for losses resulting from user interactions, 
                  vehicle transactions, or third-party actions. Use of the platform is at your own risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <p className="text-gray-600">
                  For questions about these terms, contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Email: legal@carconnectghana.com</p>
                  <p className="text-gray-600">Phone: +233 59 181 8492</p>
                  <p className="text-gray-600">Address: 121 Independence Avenue, Accra, Ghana</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
