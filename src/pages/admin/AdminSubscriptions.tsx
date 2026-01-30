import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Star, 
  Gem,
  Car,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Download,
  DollarSign,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import api from '@/services/api';

interface AdminSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'basic' | 'pro' | 'enterprise' | 'platinum';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  paymentMethod: string;
  autoRenew: boolean;
  totalPaid: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
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

interface SubscriptionMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
  churnRate: number;
  averageRevenuePerUser: number;
  planDistribution: {
    basic: number;
    pro: number;
    enterprise: number;
    platinum: number;
  };
}

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<AdminSubscription[]>([]);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subscriptions');

  useEffect(() => {
    // Load subscriptions from Supabase
    const loadSubscriptions = async () => {
      try {
        // Note: This would need a getAllSubscriptions method in the API
        // For now, we'll use an empty array as the subscription data structure
        // would need to be implemented based on your specific requirements
        setSubscriptions([]);
        setFilteredSubscriptions([]);
        
        // Set basic metrics
        setMetrics({
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          cancelledSubscriptions: 0,
          trialSubscriptions: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
          totalRevenue: 0,
          churnRate: 0,
          averageRevenuePerUser: 0,
          planDistribution: {
            basic: 0,
            pro: 0,
            enterprise: 0,
            platinum: 0
          }
        });
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      }
    };

    loadSubscriptions();
  }, []);

  useEffect(() => {
    let filtered = subscriptions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Apply plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(sub => sub.plan === planFilter);
    }

    setFilteredSubscriptions(filtered);
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  const getPlanInfo = (plan: string) => {
    const plans = {
      basic: { name: 'Basic', icon: Car, color: 'text-gray-600' },
      pro: { name: 'Pro', icon: Star, color: 'text-blue-600' },
      enterprise: { name: 'Enterprise', icon: Crown, color: 'text-purple-600' },
      platinum: { name: 'Platinum', icon: Gem, color: 'text-yellow-600' }
    };
    return plans[plan as keyof typeof plans] || plans.basic;
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

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600">Manage user subscriptions and revenue</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalSubscriptions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeSubscriptions}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.churnRate}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search subscriptions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
              <CardDescription>
                All user subscriptions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Total Paid</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => {
                      const planInfo = getPlanInfo(subscription.plan);
                      const Icon = planInfo.icon;
                      
                      return (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{subscription.userName}</p>
                              <p className="text-sm text-gray-600">{subscription.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-4 w-4 ${planInfo.color}`} />
                              <span className="font-medium">{planInfo.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="capitalize">{subscription.billingCycle}</p>
                              <p className="text-gray-600">{subscription.autoRenew ? 'Auto-renew' : 'Manual'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">
                              {subscription.amount === 0 ? 'Free' : formatPrice(subscription.amount)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{formatCurrency(subscription.totalPaid)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {subscription.nextPaymentDate ? (
                                <>
                                  <p>{new Date(subscription.nextPaymentDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600">
                                    {Math.ceil((new Date(subscription.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                  </p>
                                </>
                              ) : (
                                <p className="text-gray-500">-</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Plan Distribution
                </CardTitle>
                <CardDescription>
                  Subscription distribution across plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.planDistribution).map(([plan, count]) => {
                    const planInfo = getPlanInfo(plan);
                    const Icon = planInfo.icon;
                    const percentage = (count / metrics.totalSubscriptions) * 100;
                    
                    return (
                      <div key={plan} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 w-32">
                          <Icon className={`h-4 w-4 ${planInfo.color}`} />
                          <span className="text-sm font-medium capitalize">{plan}</span>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 w-16 text-right">
                          {count} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>
                  Monthly revenue breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Revenue trends chart coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Current month earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(metrics.monthlyRevenue)}
                </div>
                <p className="text-sm text-gray-600 mt-2">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yearly Revenue</CardTitle>
                <CardDescription>Annual recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(metrics.yearlyRevenue)}
                </div>
                <p className="text-sm text-gray-600 mt-2">+22% from last year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Revenue Per User</CardTitle>
                <CardDescription>ARPU metric</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(metrics.averageRevenuePerUser)}
                </div>
                <p className="text-sm text-gray-600 mt-2">+8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by plan type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.planDistribution).map(([plan, count]) => {
                  const planPrices = {
                    basic: 0,
                    pro: 29,
                    enterprise: 99,
                    platinum: 299
                  };
                  const revenue = count * planPrices[plan as keyof typeof planPrices];
                  const planInfo = getPlanInfo(plan);
                  const Icon = planInfo.icon;
                  
                  return (
                    <div key={plan} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${planInfo.color}`} />
                        <div>
                          <p className="font-medium capitalize">{plan} Plan</p>
                          <p className="text-sm text-gray-600">{count} subscribers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(revenue)}</p>
                        <p className="text-sm text-gray-600">
                          {((revenue / metrics.totalRevenue) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subscription Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              View detailed information about this subscription
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscription && (
            <div className="space-y-6">
              {/* User and Plan Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSubscription.userName}</h3>
                    <p className="text-gray-600">{selectedSubscription.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(selectedSubscription.status)}>
                      {selectedSubscription.status.charAt(0).toUpperCase() + selectedSubscription.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {(() => {
                        const planInfo = getPlanInfo(selectedSubscription.plan);
                        const Icon = planInfo.icon;
                        return <Icon className={`h-4 w-4 ${planInfo.color}`} />;
                      })()}
                      <span className="font-medium capitalize">{selectedSubscription.plan}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Billing Cycle</p>
                    <p className="font-medium capitalize">{selectedSubscription.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">
                      {selectedSubscription.amount === 0 ? 'Free' : formatPrice(selectedSubscription.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auto-renew</p>
                    <p className="font-medium">{selectedSubscription.autoRenew ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold">Important Dates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-medium">
                      {new Date(selectedSubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ends</p>
                    <p className="font-medium">
                      {selectedSubscription.endDate ? 
                        new Date(selectedSubscription.endDate).toLocaleDateString() : 
                        'No end date'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Payment</p>
                    <p className="font-medium">
                      {selectedSubscription.lastPaymentDate ? 
                        new Date(selectedSubscription.lastPaymentDate).toLocaleDateString() : 
                        'No payment'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Payment</p>
                    <p className="font-medium">
                      {selectedSubscription.nextPaymentDate ? 
                        new Date(selectedSubscription.nextPaymentDate).toLocaleDateString() : 
                        'No next payment'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold">Financial Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="font-medium">{formatCurrency(selectedSubscription.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{selectedSubscription.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold">Subscription Benefits</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedSubscription.benefits.listingDiscount > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{selectedSubscription.benefits.listingDiscount}% off listing fees</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.freeListings > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{selectedSubscription.benefits.freeListings} free listings</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.featuredDiscount > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{selectedSubscription.benefits.featuredDiscount}% off featured</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.prioritySupport && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.analytics && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Analytics access</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.bulkListing && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Bulk listing tools</span>
                    </div>
                  )}
                  {selectedSubscription.benefits.verifiedBadge && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Verified badge</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptions;
