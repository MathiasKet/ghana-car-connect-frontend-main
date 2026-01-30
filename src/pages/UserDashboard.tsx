import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Car, 
  Plus, 
  CreditCard, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  TrendingUp,
  Users,
  DollarSign,
  LogOut,
  Crown,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { PaymentVerificationPanel } from '@/components/PaymentVerification';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import api from '@/services/api';

interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  inquiries: number;
  featured: boolean;
  createdAt: string;
  images: string[];
}

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0
  });
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Supabase authentication
  const { user: supabaseUser, loading: authLoading } = useSupabaseAuth();
  
  // Supabase real-time synchronization
  const { lastUpdate, isConnected } = useSupabaseRealtime(supabaseUser?.id);

  // Load initial data
  useEffect(() => {
    // Don't redirect while auth is still initializing
    if (authLoading) return;

    if (!supabaseUser) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [supabaseUser, authLoading, navigate]);

  const loadUserData = async () => {
    try {
      // Load user's car listings
      const listings = await api.getUserCars(supabaseUser.id);
      setCarListings(listings);
      
      // Load user's subscription
      let subscription = await api.getUserSubscription(supabaseUser.id);
      
      // If no subscription found, create default Basic subscription data
      if (!subscription) {
        subscription = {
          plan: 'basic',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '2999-12-31',
          auto_renew: true,
          benefits: {
            listingLimit: 2,
            featuredListings: 0,
            prioritySupport: false,
            analytics: false,
            bulkListing: false,
            verifiedBadge: false
          }
        };
      }
      setSubscription(subscription);
      
      // Load user's payments
      const payments = await api.getUserPaymentHistory(supabaseUser.id);
      setPayments(payments);
      
      updateStats();
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Refresh functions
  const refreshListings = async () => {
    if (!supabaseUser) return;
    
    try {
      const listings = await api.getUserCars(supabaseUser.id);
      setCarListings(listings);
      console.log('Refreshed listings from Supabase');
    } catch (error) {
      console.error('Failed to refresh listings:', error);
    }
  };

  const refreshPayments = async () => {
    if (!supabaseUser) return;
    
    try {
      const payments = await api.getUserPaymentHistory(supabaseUser.id);
      setPayments(payments);
      console.log('Refreshed payments from Supabase');
    } catch (error) {
      console.error('Failed to refresh payments:', error);
    }
  };

  const refreshSubscription = async () => {
    if (!supabaseUser) return;
    
    try {
      const subscription = await api.getUserSubscription(supabaseUser.id);
      setSubscription(subscription);
      console.log('Refreshed subscription from Supabase');
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 latest
  };

  const updateStats = () => {
    const activeListings = carListings.filter(l => l.status === 'active').length;
    const totalViews = carListings.reduce((sum, l) => sum + l.views, 0);
    const totalInquiries = carListings.reduce((sum, l) => sum + l.inquiries, 0);
    
    setStats({
      totalListings: carListings.length,
      activeListings,
      totalViews,
      totalInquiries
    });
  };

  // Auto-refresh on relevant events
  useEffect(() => {
    if (lastUpdate) {
      console.log('Real-time update received:', lastUpdate);
      
      // Refresh data based on event type
      switch (lastUpdate.eventType) {
        case 'listing_active':
        case 'listing_pending':
        case 'listing_sold':
        case 'listing_rejected':
          refreshListings();
          break;
        case 'payment_completed':
        case 'payment_failed':
          refreshPayments();
          break;
        default:
          // Refresh all data for other events
          loadUserData();
      }
      
      // Show notification for user-specific events
      const message = getEventMessage(lastUpdate);
      if (message) {
        addNotification({
          type: lastUpdate.eventType,
          message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [lastUpdate]);

  const getEventMessage = (event: any): string => {
    switch (event.eventType) {
      case 'listing_active':
        return 'Your car listing has been approved! 🎉';
      case 'listing_rejected':
        return 'Your car listing was rejected. Please review the requirements.';
      case 'listing_featured':
        return 'Your listing is now featured! ⭐';
      case 'listing_sold':
        return 'Congratulations! Your car has been marked as sold.';
      case 'payment_completed':
        return 'Your payment has been verified successfully.';
      case 'payment_failed':
        return 'There was an issue with your payment.';
      case 'user_reactivated':
        return 'Your account has been reactivated.';
      case 'user_suspended':
        return 'Your account has been suspended.';
      default:
        return '';
    }
  };

  // Update stats when listings change
  useEffect(() => {
    updateStats();
  }, [carListings]);

  const handleLogout = async () => {
    await api.logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!supabaseUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Car className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">
                  <span className="text-primary">Car</span>
                  <span className="text-secondary">Connect</span>
                </span>
              </Link>
              <h1 className="text-lg font-semibold text-gray-600">My Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Offline</span>
                  </>
                )}
              </div>
              
              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="text-xs">
                    {notifications.length}
                  </Badge>
                </div>
              )}
              
              <Link to="/payment">
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {supabaseUser.name || supabaseUser.email}!
          </h2>
          <p className="text-gray-600">Manage your car listings and track your performance</p>
        </div>

        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <Alert key={index} className="animate-in slide-in-from-top duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {notification.message}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status Card */}
        {subscription && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold capitalize">{subscription.plan} Plan</h3>
                      <Badge className="bg-green-100 text-green-800">
                        {subscription.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {subscription.endDate 
                        ? `Renews on ${new Date(subscription.endDate).toLocaleDateString()}`
                        : 'Valid forever'
                      }
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      {subscription.benefits?.listingDiscount > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {subscription.benefits.listingDiscount}% off listings
                        </span>
                      )}
                      {subscription.benefits?.freeListings > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {subscription.benefits.freeListings} free listings
                        </span>
                      )}
                      {subscription.benefits?.verifiedBadge && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Verified seller
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to="/subscription">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                  <Link to="/subscription-plans">
                    <Button size="sm">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Subscription Prompt */}
        {!subscription && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Crown className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
                    <p className="text-sm text-gray-600">
                      Get discounts on listing fees, free listings, and more benefits
                    </p>
                  </div>
                </div>
                <Link to="/subscription-plans">
                  <Button>
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Car Listings</h3>
              <Link to="/list-car">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  List New Car
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carListings.map((car) => (
                <Card key={car.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(car.status)}>
                        {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                      </Badge>
                      {car.featured && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {car.make} {car.model}
                        </h4>
                        <p className="text-sm text-gray-600">{car.year}</p>
                      </div>
                      
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(car.price)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {car.views}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {car.inquiries}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentVerificationPanel userId={user?.id} isAdmin={false} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your listing performance and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Inquiries</CardTitle>
                <CardDescription>
                  Manage inquiries from potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No new messages</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
