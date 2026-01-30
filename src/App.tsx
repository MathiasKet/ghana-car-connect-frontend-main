import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Toaster as HotToaster } from 'react-hot-toast';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";
import About from "./pages/About";
import ListingPayment from "./pages/ListingPayment";
import ListingSuccess from "./pages/ListingSuccess";
import ValueAddedServices from "./pages/ValueAddedServices";
import ServicesPayment from "./pages/ServicesPayment";
import CarDetails from "./pages/CarDetails";
import CarEstimate from "./pages/CarEstimate";
import Advertising from "./pages/Advertising";
import DealerAccount from "./pages/DealerAccount";
import { PaystackTest } from "./components/PaystackTest";
import PaymentTest from "./components/PaymentTest";
import RealtimeTest from "./components/RealtimeTest";
import SupabaseTest from "./components/SupabaseTest";
import AuthTest from "./components/AuthTest";
import PaymentVerificationPanel from "./components/PaymentVerification";
import ImageUpload from "./components/ImageUpload";
import ImageUploadTest from "./components/ImageUploadTest";
import AdminImageUploadTest from "./components/AdminImageUploadTest.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminHero from "./pages/admin/AdminHero.tsx";
import AdminFeatured from "./pages/admin/AdminFeatured.tsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminCarListings from "./pages/admin/AdminCarListings.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import ListCar from "./pages/ListCar.tsx";
import Payment from "./pages/Payment.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import PaymentFailed from "./pages/PaymentFailed.tsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.tsx";
import SubscriptionCheckout from "./pages/SubscriptionCheckout.tsx";
import UserSubscription from "./pages/UserSubscription.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import CookiesPolicy from "./pages/CookiesPolicy.tsx";
import VehicleInspection from "./pages/VehicleInspection.tsx";
import CarInsurance from "./pages/CarInsurance.tsx";
import CarFinancing from "./pages/CarFinancing.tsx";
import CarTransport from "./pages/CarTransport.tsx";
import VehicleHistoryReports from "./pages/VehicleHistoryReports";
import CarBooking from "./pages/CarBooking";
import BookingConfirmation from "./pages/BookingConfirmation";

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
            <Route path="/test-payment" element={<PaystackTest />} />
            <Route path="/test-payment-flow" element={<PaymentTest />} />
            <Route path="/test-realtime" element={<RealtimeTest />} />
            <Route path="/test-supabase" element={<SupabaseTest />} />
            <Route path="/test-auth" element={<AuthTest />} />
            <Route path="/test-payments" element={<PaymentVerificationPanel />} />
            <Route path="/test-images" element={<ImageUploadTest />} />
            <Route path="/test-admin-images" element={<AdminImageUploadTest />} />
            
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
