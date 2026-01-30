import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import PaystackService from '@/services/paystackService';

export const PaystackTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);

  const handleTestPayment = async () => {
    if (!email || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await PaystackService.initializePayment({
        email,
        amount: parseFloat(amount),
        currency: 'GHS',
        metadata: {
          test: true,
          description: 'Test payment'
        }
      });

      if (response.status === 'success') {
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed: ' + response.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Paystack Test</CardTitle>
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
            placeholder="100"
            min="1"
          />
        </div>

        <Button 
          onClick={handleTestPayment} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Test Payment (GHS ' + amount + ')'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          This will open a Paystack payment modal in test mode.
        </p>
      </CardContent>
    </Card>
  );
};

export default PaystackTest;
