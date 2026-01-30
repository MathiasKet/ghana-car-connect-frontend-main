import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react";

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                <p className="text-gray-600">
                  CarConnect Ghana respects your privacy and is committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and protect your information when you use our platform.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Information We Collect</h2>
                </div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Account information (login credentials, preferences)</li>
                  <li>Vehicle information (make, model, year, photos)</li>
                  <li>Transaction data (payments, listings history)</li>
                  <li>Usage data (how you interact with our platform)</li>
                  <li>Device and location information</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">How We Use Your Information</h2>
                </div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>To provide and maintain our services</li>
                  <li>To process transactions and payments</li>
                  <li>To verify user identity and prevent fraud</li>
                  <li>To communicate with you about your account</li>
                  <li>To improve our services and user experience</li>
                  <li>To send marketing communications (with consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Lock className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Data Protection</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure storage of sensitive information</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Object to data processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this privacy policy or how we handle your data, 
                  please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Email: privacy@carconnectghana.com</p>
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

export default PrivacyPolicy;
