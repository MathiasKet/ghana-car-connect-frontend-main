import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Crown,
  Star,
  Gem,
  Car,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  CreditCard,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import SupabaseService from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

interface UserSubscription {
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'yearly';
  benefits: {
    listingDiscount: number;
    freeListings: number;
    featuredDiscount: number;
    prioritySupport: boolean;
    analytics: boolean;
    bulkListing: boolean;
    verifiedBadge: boolean;
  };
}

interface UsageStats {
  totalListings: number;
  usedFreeListings: number;
  totalViews: number;
  totalInquiries: number;
  savingsAmount: number;
  featuredListingsUsed: number;
}

const UserSubscription = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const loadSubscriptionData = async () => {
        try {
          // Fetch real subscription from Supabase
          const dbSub = await SupabaseService.getUserSubscription(parsedUser.id);

          if (dbSub) {
            const benefits = dbSub.benefits as any;
            setSubscription({
              plan: dbSub.plan,
              status: dbSub.status as UserSubscription['status'],
              startDate: dbSub.start_date,
              endDate: dbSub.end_date,
              billingCycle: 'monthly',
              benefits: {
                listingDiscount: benefits?.listingDiscount ?? 0,
                freeListings: benefits?.freeListings ?? benefits?.listingLimit ?? 0,
                featuredDiscount: benefits?.featuredDiscount ?? 0,
                prioritySupport: benefits?.prioritySupport ?? false,
                analytics: benefits?.analytics ?? false,
                bulkListing: benefits?.bulkListing ?? false,
                verifiedBadge: benefits?.verifiedBadge ?? false,
              }
            });
          } else {
            setSubscription(null);
          }

          // Fetch real listing stats
          const { data: listings } = await supabase
            .from('car_listings')
            .select('views, inquiries, status')
            .eq('user_id', parsedUser.id);

          const totalListings = listings?.length ?? 0;
          const totalViews = listings?.reduce((s, l) => s + (l.views || 0), 0) ?? 0;
          const totalInquiries = listings?.reduce((s, l) => s + (l.inquiries || 0), 0) ?? 0;

          setUsageStats({
            totalListings,
            usedFreeListings: totalListings,
            totalViews,
            totalInquiries,
            savingsAmount: 0,
            featuredListingsUsed: listings?.filter(l => l.status === 'active').length ?? 0,
          });
        } catch (error) {
          console.error('Failed to load subscription data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadSubscriptionData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getPlanInfo = (planId: string) => {
    const plans = {
      basic: { name: 'Basic', icon: Car, color: 'text-gray-600' },
      pro: { name: 'Pro', icon: Star, color: 'text-blue-600' },
      enterprise: { name: 'Enterprise', icon: Crown, color: 'text-purple-600' },
      platinum: { name: 'Platinum', icon: Gem, color: 'text-yellow-600' }
    };
    return plans[planId as keyof typeof plans] || plans.basic;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelSubscription = async () => {
    // Mock cancellation
    setIsCancelDialogOpen(false);
    setSubscription(prev => prev ? { ...prev, status: 'cancelled' } : null);
  };

  const handleUpgradePlan = () => {
    setIsUpgradeDialogOpen(false);
    navigate('/subscription-plans');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-gray-600">Loading your subscription...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // No active subscription — show a clean empty state
  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">My Subscription</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-sm border p-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Plan</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                You don't have an active subscription yet. Upgrade to a plan to unlock exclusive benefits like discounted listing fees, free listings, priority support, and more.
              </p>
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={() => navigate('/subscription-plans')}>
                  <Crown className="h-5 w-5 mr-2" />
                  Browse Subscription Plans
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-6">
                All plans include a 7-day free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const planInfo = getPlanInfo(subscription.plan);
  const Icon = planInfo.icon;
  const daysUntilRenewal = Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">My Subscription</span>
              </div>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current Subscription */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{planInfo.name} Plan</h2>
                    <p className="text-gray-600">Your current subscription</p>
                  </div>
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Billing Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <span className="text-sm font-medium">{planInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Billing Cycle</span>
                      <span className="text-sm font-medium capitalize">{subscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Started</span>
                      <span className="text-sm font-medium">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Renews</span>
                      <span className="text-sm font-medium">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Days until renewal</span>
                      <span className="text-sm font-medium text-primary">{daysUntilRenewal} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Subscription Benefits</h4>
                  <div className="space-y-2">
                    {subscription.benefits?.listingDiscount > 0 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{subscription.benefits.listingDiscount}% off listing fees</span>
                      </div>
                    )}
                    {subscription.benefits?.freeListings > 0 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{subscription.benefits.freeListings} free listings per month</span>
                      </div>
                    )}
                    {subscription.benefits?.featuredDiscount > 0 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{subscription.benefits.featuredDiscount}% off featured listings</span>
                      </div>
                    )}
                    {subscription.benefits?.prioritySupport && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Priority customer support</span>
                      </div>
                    )}
                    {subscription.benefits?.analytics && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Advanced analytics dashboard</span>
                      </div>
                    )}
                    {subscription.benefits?.bulkListing && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Bulk listing management</span>
                      </div>
                    )}
                    {subscription.benefits?.verifiedBadge && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Verified seller badge</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setIsUpgradeDialogOpen(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel your {planInfo.name} subscription?
                            You'll lose access to all premium benefits at the end of your billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                            Keep Subscription
                          </Button>
                          <Button variant="destructive" onClick={handleCancelSubscription}>
                            Cancel Subscription
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{usageStats?.totalListings || 0}</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Free Listings Used</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {usageStats?.usedFreeListings || 0} / {subscription.benefits?.freeListings || 0}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(usageStats?.savingsAmount || 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{usageStats?.totalViews || 0}</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="billing">Billing History</TabsTrigger>
              <TabsTrigger value="usage">Usage Details</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                      How your listings are performing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Performance analytics coming soon...</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Listing Insights</CardTitle>
                    <CardDescription>
                      Detailed breakdown of your listing performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Listing insights coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    Your subscription payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{planInfo.name} Plan - {subscription.billingCycle}</p>
                        <p className="text-sm text-gray-600">Paid on {new Date(subscription.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">GHS 50</p>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Details</CardTitle>
                  <CardDescription>
                    How you're using your subscription benefits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Free Listings Usage</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${((usageStats?.usedFreeListings || 0) / (subscription.benefits?.freeListings || 1)) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {usageStats?.usedFreeListings || 0} of {subscription.benefits?.freeListings || 0} free listings used
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Monthly Savings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(usageStats?.savingsAmount || 0)}
                          </p>
                          <p className="text-sm text-gray-600">Saved this month</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {subscription.benefits?.listingDiscount || 0}%
                          </p>
                          <p className="text-sm text-gray-600">Discount rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Unlock more features and save more with a higher tier plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-600">Ready to upgrade? Check out our available plans.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                Maybe Later
              </Button>
              <Button onClick={handleUpgradePlan}>
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSubscription;
