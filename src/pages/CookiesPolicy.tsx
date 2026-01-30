import { Link } from "react-router-dom";
import { ArrowLeft, Cookie, Settings, Shield, Info } from "lucide-react";

const CookiesPolicy = () => {
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
              <Cookie className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Cookies Policy</h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
                <p className="text-gray-600">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us improve your experience by remembering your preferences and tracking usage patterns.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Cookie className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Types of Cookies We Use</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      Required for the website to function properly, including user authentication 
                      and security features.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Performance Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      Help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Functional Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      Enable enhanced functionality and personalization, such as remembering 
                      your preferences and login status.
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                    <p className="text-gray-600 text-sm">
                      Used to deliver advertisements that are relevant to you and your interests, 
                      and to track marketing campaign effectiveness.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Managing Your Cookie Preferences</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Browser settings to block or delete cookies</li>
                  <li>Cookie consent banner on our website</li>
                  <li>Privacy settings in your user account</li>
                  <li>Opt-out of marketing cookies through preferences</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Note that blocking essential cookies may affect website functionality.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Cookie Security</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We implement security measures to protect cookie data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>HTTP-only and Secure flags for sensitive cookies</li>
                  <li>Regular security audits and updates</li>
                  <li>Encryption of cookie data transmission</li>
                  <li>Limited cookie lifespan and scope</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Info className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Third-Party Cookies</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We may use third-party services that set cookies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Payment processors for transaction security</li>
                  <li>Social media platforms for sharing features</li>
                  <li>Advertising networks for targeted ads</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  These third parties have their own privacy policies and cookie practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cookie Duration</h2>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Session Cookies</span>
                    <span className="text-gray-600">Deleted when browser closes</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Persistent Cookies</span>
                    <span className="text-gray-600">30 days to 1 year</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Authentication Cookies</span>
                    <span className="text-gray-600">24 hours to 30 days</span>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
                <p className="text-gray-600">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Accept or reject non-essential cookies</li>
                  <li>View what cookies are stored on your device</li>
                  <li>Delete cookies at any time</li>
                  <li>Withdraw consent for cookie usage</li>
                  <li>Request information about cookie data processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-gray-600">
                  We may update this cookies policy from time to time. Changes will be posted on this page 
                  with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about our cookies policy, please contact us at:
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

export default CookiesPolicy;
