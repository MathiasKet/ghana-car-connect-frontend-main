import api from './api';

export interface PaymentVerification {
  reference: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  paidAt: string;
  customer: {
    email: string;
    name: string;
  };
  metadata: {
    type: 'listing' | 'subscription' | 'services';
    listingId?: string;
    planId?: string;
    services?: string[];
    userId: string;
  };
}

export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  recentPayments: PaymentVerification[];
}

export class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Verify payment with Supabase
  async verifyPayment(reference: string): Promise<PaymentVerification> {
    try {
      const payment = await api.verifyPayment(reference);
      
      return {
        reference: payment.reference,
        status: payment.status === 'completed' ? 'success' : 
                payment.status === 'failed' ? 'failed' : 'pending',
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.verified_at || payment.created_at,
        customer: {
          email: payment.user_id, // Would need to join with users table
          name: 'User' // Would need to join with users table
        },
        metadata: {
          type: payment.type,
          userId: payment.user_id,
          ...payment.metadata
        }
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  // Get payment statistics from Supabase
  async getPaymentStats(userId?: string): Promise<PaymentStats> {
    try {
      const stats = await api.getPaymentStats(userId);
      
      return {
        totalPayments: stats.totalPayments,
        successfulPayments: stats.successfulPayments,
        failedPayments: stats.failedPayments,
        pendingPayments: stats.pendingPayments,
        totalRevenue: stats.totalRevenue,
        recentPayments: stats.recentPayments.map((payment: any) => ({
          reference: payment.reference,
          status: payment.status === 'completed' ? 'success' : 
                  payment.status === 'failed' ? 'failed' : 'pending',
          amount: payment.amount,
          currency: payment.currency,
          paidAt: payment.verified_at || payment.created_at,
          customer: {
            email: payment.user_id,
            name: 'User'
          },
          metadata: {
            type: payment.type,
            userId: payment.user_id,
            ...payment.metadata
          }
        }))
      };
    } catch (error) {
      console.error('Failed to get payment stats:', error);
      throw error;
    }
  }

  // Get user payment history from Supabase
  async getUserPaymentHistory(userId?: string): Promise<PaymentVerification[]> {
    try {
      const payments = await api.getUserPaymentHistory(userId);
      
      return payments.map((payment: any) => ({
        reference: payment.reference,
        status: payment.status === 'completed' ? 'success' : 
                payment.status === 'failed' ? 'failed' : 'pending',
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.verified_at || payment.created_at,
        customer: {
          email: payment.user_id,
          name: 'User'
        },
        metadata: {
          type: payment.type,
          userId: payment.user_id,
          ...payment.metadata
        }
      }));
    } catch (error) {
      console.error('Failed to get payment history:', error);
      throw error;
    }
  }

  // Get payment details from Supabase
  async getPaymentDetails(reference: string): Promise<PaymentVerification> {
    try {
      const payment = await api.getPaymentDetails(reference);
      
      return {
        reference: payment.reference,
        status: payment.status === 'completed' ? 'success' : 
                payment.status === 'failed' ? 'failed' : 'pending',
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.verified_at || payment.created_at,
        customer: {
          email: payment.user_id,
          name: 'User'
        },
        metadata: {
          type: payment.type,
          userId: payment.user_id,
          ...payment.metadata
        }
      };
    } catch (error) {
      console.error('Failed to get payment details:', error);
      throw error;
    }
  }

  // Create payment in Supabase
  async createPayment(paymentData: {
    reference: string;
    amount: number;
    type: 'listing' | 'subscription' | 'services';
    userId: string;
    metadata?: any;
  }): Promise<PaymentVerification> {
    try {
      const payment = await api.createPayment({
        reference: paymentData.reference,
        amount: paymentData.amount,
        type: paymentData.type,
        user_id: paymentData.userId,
        metadata: paymentData.metadata || {},
        payment_method: 'card', // Default, can be updated
        provider: 'paystack',
        currency: 'GHS'
      });
      
      return {
        reference: payment.reference,
        status: 'pending',
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.created_at,
        customer: {
          email: payment.user_id,
          name: 'User'
        },
        metadata: {
          type: payment.type,
          userId: payment.user_id,
          ...payment.metadata
        }
      };
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  }

  // Generate receipt for payment
  async generateReceipt(reference: string): Promise<string> {
    try {
      const payment = await this.getPaymentDetails(reference);
      
      // Generate receipt URL (this would typically be a PDF generation service)
      const receiptData = {
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        date: payment.paidAt,
        customer: payment.customer,
        type: payment.metadata.type
      };
      
      // For now, return a mock receipt URL
      return `/receipts/${reference}.pdf`;
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(reference: string, reason: string): Promise<boolean> {
    try {
      // Update payment status to refunded in Supabase
      await api.updatePaymentStatus(reference, 'refunded');
      return true;
    } catch (error) {
      console.error('Failed to process refund:', error);
      return false;
    }
  }
}

export default PaymentService.getInstance();
