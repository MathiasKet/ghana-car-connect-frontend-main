import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Eye, 
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Smartphone,
  Building,
  Receipt,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminSync } from '@/hooks/useRealtimeSync';
import api from '@/services/api';

interface AdminTransaction {
  id: string;
  type: 'listing_fee' | 'featured_upgrade' | 'refund' | 'chargeback';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'mobile_money' | 'card' | 'bank_transfer';
  provider: string;
  userId: string;
  userName: string;
  userEmail: string;
  listingId?: string;
  listingMake?: string;
  listingModel?: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  transactionId: string;
  gatewayFee: number;
  netAmount: number;
}

interface AdminPaymentMethod {
  id: string;
  userId: string;
  userName: string;
  type: 'mobile_money' | 'card' | 'bank_transfer';
  provider: string;
  lastFour: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  lastUsed?: string;
  totalTransactions: number;
  totalAmount: number;
}

const AdminPayments = () => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<AdminPaymentMethod[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<AdminTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Real-time sync for admin actions
  const { triggerPaymentUpdate } = useAdminSync();

  useEffect(() => {
    // Load data from Supabase
    const loadData = async () => {
      try {
        const allPayments = await api.getAllPayments();
        setTransactions(allPayments);
        setFilteredTransactions(allPayments);
        
        // Load payment methods from payments data
        const paymentMethodsData = await api.getPaymentMethods();
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error('Failed to load payment data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    if (methodFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.paymentMethod === methodFilter);
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(transaction => 
        new Date(transaction.createdAt) >= startDate
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, typeFilter, methodFilter, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'listing_fee': return 'bg-blue-100 text-blue-800';
      case 'featured_upgrade': return 'bg-purple-100 text-purple-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      case 'chargeback': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'mobile_money': return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer': return <Building className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate statistics
  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.netAmount, 0);
  
  const pendingRevenue = transactions
    .filter(t => t.status === 'pending' && t.amount > 0)
    .reduce((sum, t) => sum + t.netAmount, 0);
  
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-600">Manage all payment transactions and methods</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingRevenue)}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTransactions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{failedTransactions}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-40">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="listing_fee">Listing Fee</SelectItem>
                      <SelectItem value="featured_upgrade">Featured Upgrade</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="chargeback">Chargeback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
              <CardDescription>
                All payment transactions on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.transactionId}</p>
                            {transaction.listingMake && transaction.listingModel && (
                              <p className="text-sm text-gray-600">
                                {transaction.listingMake} {transaction.listingModel}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.userName}</p>
                            <p className="text-sm text-gray-600">{transaction.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type.replace('_', ' ').charAt(0).toUpperCase() + 
                             transaction.type.replace('_', ' ').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPaymentIcon(transaction.paymentMethod)}
                            <span className="text-sm">{transaction.provider}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : ''}`}>
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Net: {formatCurrency(transaction.netAmount)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                          {transaction.failureReason && (
                            <p className="text-xs text-red-600 mt-1">{transaction.failureReason}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-600">
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods ({paymentMethods.length})</CardTitle>
              <CardDescription>
                All payment methods used by users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{method.userName}</p>
                            <p className="text-sm text-gray-600">ID: {method.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPaymentIcon(method.type)}
                            <span className="capitalize">{method.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{method.provider}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm">****{method.lastFour}</p>
                            {method.isDefault && (
                              <Badge variant="secondary" className="mt-1">Default</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{method.totalTransactions}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(method.totalAmount)}</p>
                            {method.lastUsed && (
                              <p className="text-xs text-gray-500">
                                Last: {new Date(method.lastUsed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {method.isVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {!method.isVerified && (
                              <Badge variant="outline" className="text-yellow-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(method.createdAt).toLocaleDateString()}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Revenue analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
                <CardDescription>
                  Usage breakdown by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Payment method analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View detailed information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="font-medium">{selectedTransaction.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge className={getTypeColor(selectedTransaction.type)}>
                    {selectedTransaction.type.replace('_', ' ').charAt(0).toUpperCase() + 
                     selectedTransaction.type.replace('_', ' ').slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className={`font-medium ${selectedTransaction.amount < 0 ? 'text-red-600' : ''}`}>
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gateway Fee</span>
                  <span className="font-medium">{formatCurrency(selectedTransaction.gatewayFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Amount</span>
                  <span className="font-medium">{formatCurrency(selectedTransaction.netAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <div className="flex items-center space-x-2">
                    {getPaymentIcon(selectedTransaction.paymentMethod)}
                    <span>{selectedTransaction.provider}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User</span>
                  <div>
                    <p className="font-medium">{selectedTransaction.userName}</p>
                    <p className="text-sm text-gray-600">{selectedTransaction.userEmail}</p>
                  </div>
                </div>
                {selectedTransaction.listingMake && selectedTransaction.listingModel && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Listing</span>
                    <span className="font-medium">
                      {selectedTransaction.listingMake} {selectedTransaction.listingModel}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedTransaction.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium">
                      {new Date(selectedTransaction.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedTransaction.failureReason && (
                  <div>
                    <span className="text-sm text-gray-600">Failure Reason</span>
                    <p className="text-sm text-red-600 mt-1">{selectedTransaction.failureReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
