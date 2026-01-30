import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, TestTube } from 'lucide-react';
import PaystackService from '@/services/paystackService';

const PaymentTest = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('test@example.com');
  const [amount, setAmount] = useState('50');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const paymentData = {
        email,
        amount: parseFloat(amount),
        currency: 'GHS',
        metadata: {
          type: 'listing',
          test: true
        },
        callback: (response: any) => {
          console.log('Payment callback:', response);
          setResult(response);
        },
        onClose: () => {
          console.log('Payment closed');
          setResult({ status: 'closed', message: 'Payment was cancelled' });
        }
      };

      const response = await PaystackService.initializePayment(paymentData);
      setResult(response);
      
      // Navigate to appropriate page based on result
      if (response.status === 'success') {
        const paymentState = {
          reference: response.reference,
          amount: parseFloat(amount),
          currency: 'GHS',
          type: 'listing' as const,
          message: 'Test payment successful!'
        };
        localStorage.setItem('lastPayment', JSON.stringify(paymentState));
        setTimeout(() => {
          navigate('/payment/success', { state: paymentState });
        }, 1000);
      } else {
        const paymentState = {
          reference: response.reference || '',
          amount: parseFloat(amount),
          currency: 'GHS',
          type: 'listing' as const,
          error: response.message || 'Test payment failed'
        };
        localStorage.setItem('lastPayment', JSON.stringify(paymentState));
        setTimeout(() => {
          navigate('/payment/failed', { state: paymentState });
        }, 1000);
      }
    } catch (error: any) {
      console.error('Test payment error:', error);
      setResult({ 
        status: 'error', 
        message: error.message || 'Test payment failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Payment Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (GHS)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50"
                min="1"
              />
            </div>

            <Button 
              onClick={handleTestPayment}
              disabled={loading || !email || !amount}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Test Payment (GHS {amount})
                </>
              )}
            </Button>

            {result && (
              <Alert>
                <AlertDescription>
                  <strong>Result:</strong> {result.status}
                  <br />
                  <strong>Message:</strong> {result.message}
                  {result.reference && (
                    <>
                      <br />
                      <strong>Reference:</strong> {result.reference}
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Note:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>In development, payments are simulated after 2 seconds</li>
                <li>Test with any email and amount</li>
                <li>Real Paystack integration works in production</li>
                <li>Check browser console for detailed logs</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/payment/success')}
                className="flex-1"
              >
                View Success Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/payment/failed')}
                className="flex-1"
              >
                View Failed Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTest;
