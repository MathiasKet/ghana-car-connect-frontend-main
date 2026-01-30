import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PaymentService, { PaymentVerification, PaymentStats } from '@/services/paymentService';

interface PaymentVerificationPanelProps {
  userId?: string;
  isAdmin?: boolean;
}

export const PaymentVerificationPanel = ({ userId, isAdmin = false }: PaymentVerificationPanelProps) => {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchReference, setSearchReference] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentVerification | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  const paymentService = PaymentService;

  useEffect(() => {
    loadPaymentData();
  }, [userId]);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      // Load stats and payments
      const [statsData, paymentsData] = await Promise.all([
        paymentService.getPaymentStats(userId),
        paymentService.getUserPaymentHistory(userId)
      ]);
      
      setStats(statsData);
      setPayments(paymentsData || []);
    } catch (error: any) {
      console.error('Failed to load payment data:', error);
      toast.error(error.message || 'Failed to load payment data');
      // Reset state to safe defaults
      setStats(null);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (reference: string) => {
    setVerifying(reference);
    try {
      const verification = await paymentService.verifyPayment(reference);
      
      // Update the payment in the list
      setPayments(prev => (prev || []).map(p => 
        p.reference === reference ? verification : p
      ));
      
      setSelectedPayment(verification);
      toast.success('Payment verified successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Payment verification failed');
    } finally {
      setVerifying(null);
    }
  };

  const handleSearchPayment = async () => {
    if (!searchReference.trim()) {
      toast.error('Please enter a payment reference');
      return;
    }

    setLoading(true);
    try {
      const payment = await paymentService.getPaymentDetails(searchReference.trim());
      setSelectedPayment(payment);
      toast.success('Payment found!');
    } catch (error: any) {
      toast.error(error.message || 'Payment not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (reference: string) => {
    try {
      await paymentService.generateReceipt(reference);
      toast.success('Receipt downloaded!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download receipt');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'success': 'default',
      'failed': 'destructive',
      'pending': 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                All time transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successfulPayments}</div>
              <p className="text-xs text-muted-foreground">
                Completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue, 'GHS')}
              </div>
              <p className="text-xs text-muted-foreground">
                From successful payments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="verify">Verify Payment</TabsTrigger>
          {isAdmin && <TabsTrigger value="pending">Pending Verification</TabsTrigger>}
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(!payments || payments.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No payment history found</p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.reference} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{payment.reference}</span>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{formatCurrency(payment.amount, payment.currency)}</p>
                          <p>{payment.customer.name} • {payment.customer.email}</p>
                          <p>{formatDate(payment.paidAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyPayment(payment.reference)}
                            disabled={verifying === payment.reference}
                          >
                            {verifying === payment.reference ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              'Verify'
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReceipt(payment.reference)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verify Payment</CardTitle>
              <CardDescription>
                Enter payment reference to verify transaction status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="reference">Payment Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Enter payment reference..."
                    value={searchReference}
                    onChange={(e) => setSearchReference(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearchPayment} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {selectedPayment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Payment Details
                      {getStatusBadge(selectedPayment.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Reference</Label>
                        <p className="font-mono">{selectedPayment.reference}</p>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <p className="font-semibold">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </p>
                      </div>
                      <div>
                        <Label>Customer</Label>
                        <p>{selectedPayment.customer.name}</p>
                        <p className="text-sm text-gray-600">{selectedPayment.customer.email}</p>
                      </div>
                      <div>
                        <Label>Payment Date</Label>
                        <p>{formatDate(selectedPayment.paidAt)}</p>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <p className="capitalize">{selectedPayment.metadata.type}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedPayment.status)}
                          <span className="capitalize">{selectedPayment.status}</span>
                        </div>
                      </div>
                    </div>

                    {selectedPayment.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVerifyPayment(selectedPayment.reference)}
                          disabled={verifying === selectedPayment.reference}
                        >
                          {verifying === selectedPayment.reference ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Verify Payment
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadReceipt(selectedPayment.reference)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification</CardTitle>
                <CardDescription>
                  Payments awaiting manual verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(!payments || payments.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No pending payments found</p>
                    </div>
                  ) : (
                    (payments || [])
                      .filter(payment => payment.status === 'pending')
                      .map((payment) => (
                        <div key={payment.reference} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{payment.reference}</span>
                              {getStatusBadge(payment.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>{formatCurrency(payment.amount, payment.currency)}</p>
                              <p>{payment.customer.name} • {payment.customer.email}</p>
                              <p>{formatDate(payment.paidAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleVerifyPayment(payment.reference)}
                              disabled={verifying === payment.reference}
                            >
                              {verifying === payment.reference ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                'Verify'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReceipt(payment.reference)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PaymentVerificationPanel;
