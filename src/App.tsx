import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Toaster as HotToaster } from 'react-hot-toast';

// Eagerly loaded (above the fold)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Buy = lazy(() => import("./pages/Buy"));
const Rent = lazy(() => import("./pages/Rent"));
const Sell = lazy(() => import("./pages/Sell"));
const About = lazy(() => import("./pages/About"));
const ListingPayment = lazy(() => import("./pages/ListingPayment"));
const ListingSuccess = lazy(() => import("./pages/ListingSuccess"));
const ValueAddedServices = lazy(() => import("./pages/ValueAddedServices"));
const ServicesPayment = lazy(() => import("./pages/ServicesPayment"));
const CarDetails = lazy(() => import("./pages/CarDetails"));
const CarEstimate = lazy(() => import("./pages/CarEstimate"));
const Advertising = lazy(() => import("./pages/Advertising"));
const DealerAccount = lazy(() => import("./pages/DealerAccount"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const ListCar = lazy(() => import("./pages/ListCar"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const SubscriptionCheckout = lazy(() => import("./pages/SubscriptionCheckout"));
const UserSubscription = lazy(() => import("./pages/UserSubscription"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const VehicleInspection = lazy(() => import("./pages/VehicleInspection"));
const CarInsurance = lazy(() => import("./pages/CarInsurance"));
const CarFinancing = lazy(() => import("./pages/CarFinancing"));
const CarTransport = lazy(() => import("./pages/CarTransport"));
const VehicleHistoryReports = lazy(() => import("./pages/VehicleHistoryReports"));
const CarBooking = lazy(() => import("./pages/CarBooking"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero"));
const AdminFeatured = lazy(() => import("./pages/admin/AdminFeatured"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCarListings = lazy(() => import("./pages/admin/AdminCarListings"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <Sentry.ErrorBoundary
    fallback={({ error, componentStack, resetError }) => (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Something went wrong!</h2>
        <p>We're sorry, but something unexpected happened.</p>
        <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '20px' }}>
          <summary>Error Details</summary>
          <p><strong>Error:</strong> {error.toString()}</p>
          <p><strong>Component Stack:</strong></p>
          <pre>{componentStack}</pre>
        </details>
        <button 
          onClick={resetError}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4aed88',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ff6b6b',
                secondary: '#fff',
              },
            },
          }}
        />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Main Navigation Routes */}
              <Route path="/buy" element={<Buy />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/about" element={<About />} />
              <Route path="/listing-payment" element={<ListingPayment />} />
              <Route path="/listing-success" element={<ListingSuccess />} />
              <Route path="/value-added-services" element={<ValueAddedServices />} />
              <Route path="/services-payment" element={<ServicesPayment />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/estimate" element={<CarEstimate />} />
              <Route path="/advertising" element={<Advertising />} />
              <Route path="/dealer-account" element={<DealerAccount />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Dashboard Routes */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/list-car" element={<ListCar />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              
              {/* Subscription Routes */}
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/subscription-checkout" element={<SubscriptionCheckout />} />
              <Route path="/subscription" element={<UserSubscription />} />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              
              {/* Service Pages */}
              <Route path="/vehicle-inspection" element={<VehicleInspection />} />
              <Route path="/car-insurance" element={<CarInsurance />} />
              <Route path="/car-financing" element={<CarFinancing />} />
              <Route path="/car-transport" element={<CarTransport />} />
              <Route path="/vehicle-history-reports" element={<VehicleHistoryReports />} />
              
              {/* Booking Pages */}
              <Route path="/car-booking" element={<CarBooking />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="listings" element={<AdminCarListings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="featured" element={<AdminFeatured />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
