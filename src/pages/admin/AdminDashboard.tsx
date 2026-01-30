import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Car, 
  MessageSquare, 
  Settings, 
  TrendingUp,
  Users,
  Eye,
  Edit,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12% from last month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'Active Listings',
      value: '156',
      change: '+8 from last week',
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: 'GHS 12,450',
      change: '+18% from last month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
    {
      title: 'Pending Listings',
      value: '23',
      change: '-3 from yesterday',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'down'
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Review Listings',
      description: 'Approve or reject pending car listings',
      icon: Car,
      href: '/admin/listings',
      color: 'bg-green-500'
    },
    {
      title: 'View Payments',
      description: 'Monitor transactions and revenue',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'bg-purple-500'
    },
    {
      title: 'Site Settings',
      description: 'Configure site appearance and features',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_registered',
      message: 'New user registered: John Doe',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'listing_created',
      message: 'New car listing: Toyota Camry 2020',
      time: '15 minutes ago',
      icon: Car,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'payment_received',
      message: 'Payment received: GHS 50 for listing fee',
      time: '1 hour ago',
      icon: CreditCard,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'listing_approved',
      message: 'Car listing approved: Honda CR-V 2021',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 5,
      type: 'payment_failed',
      message: 'Payment failed: GHS 150 transaction',
      time: '3 hours ago',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={action.href}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user registrations, listings, and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
