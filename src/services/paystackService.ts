import api from './api';

export interface PaymentData {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  callback?: (response: PaymentResponse) => void;
  onClose?: () => void;
  metadata?: Record<string, unknown>;
}

export interface PaystackResponse {
  status: string;
  message: string;
  reference: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export interface PaymentResponse {
  status: 'success' | 'failed';
  reference: string;
  trans?: string;
  transaction?: string;
  message?: string;
  trxref?: string;
}

export class PaystackService {
  private static instance: PaystackService;
  private scriptLoaded = false;

  static getInstance(): PaystackService {
    if (!PaystackService.instance) {
      PaystackService.instance = new PaystackService();
    }
    return PaystackService.instance;
  }

  // Load Paystack script dynamically
  private async loadPaystackScript(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Paystack script'));
      };
      document.body.appendChild(script);
    });
  }

  // Initialize payment with Paystack
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadPaystackScript();

        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_94e8ce74c095bdd8c38cfdb16476893ff955155d',
          email: paymentData.email,
          amount: paymentData.amount * 100, // Convert to kobo/cents
          currency: paymentData.currency || 'GHS',
          ref: paymentData.reference || this.generateReference(),
          callback: async (response: PaymentResponse) => {
            try {
              // Verify payment on backend
              const verification = await this.verifyPayment(response.reference);
              
              if (verification.status === 'success') {
                resolve({
                  ...response,
                  status: 'success'
                });
              } else {
                resolve({
                  ...response,
                  status: 'failed',
                  message: 'Payment verification failed'
                });
              }
            } catch (error) {
              // If backend verification fails, still consider it successful in development
              if (import.meta.env.DEV) {
                resolve({
                  ...response,
                  status: 'success'
                });
              } else {
                reject(error);
              }
            }
            
            if (paymentData.callback) {
              paymentData.callback(response);
            }
          },
          onClose: () => {
            resolve({
              status: 'failed',
              reference: paymentData.reference || '',
              message: 'Payment cancelled by user'
            });
            
            if (paymentData.onClose) {
              paymentData.onClose();
            }
          },
          metadata: paymentData.metadata || {}
        });

        handler.openIframe();
      } catch (error) {
        // In development, simulate successful payment if Paystack fails to load
        if (import.meta.env.DEV) {
          console.warn('Paystack not available, simulating payment for development');
          setTimeout(() => {
            resolve({
              status: 'success',
              reference: paymentData.reference || this.generateReference(),
              message: 'Payment simulated successfully (development mode)'
            });
            if (paymentData.callback) {
              paymentData.callback({
                status: 'success',
                reference: paymentData.reference || this.generateReference()
              });
            }
          }, 2000);
        } else {
          reject(error);
        }
      }
    });
  }

  // Verify payment with backend
  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await api.get(`/payments/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      // For development, return success if backend is not available
      if (import.meta.env.DEV) {
        return { status: 'success' };
      }
      throw error;
    }
  }

  // Generate unique transaction reference
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `CAR_${timestamp}_${random}`;
  }

  // Process listing payment
  async processListingPayment(listingId: string, paymentData: PaymentData): Promise<PaymentResponse> {
    const reference = this.generateReference();
    
    return this.initializePayment({
      ...paymentData,
      reference,
      metadata: {
        type: 'listing',
        listingId,
        ...paymentData.metadata
      }
    });
  }

  // Process subscription payment
  async processSubscriptionPayment(planId: string, paymentData: PaymentData): Promise<PaymentResponse> {
    const reference = this.generateReference();
    
    return this.initializePayment({
      ...paymentData,
      reference,
      metadata: {
        type: 'subscription',
        planId,
        ...paymentData.metadata
      }
    });
  }

  // Process services payment
  async processServicesPayment(services: string[], paymentData: PaymentData): Promise<PaymentResponse> {
    const reference = this.generateReference();
    
    return this.initializePayment({
      ...paymentData,
      reference,
      metadata: {
        type: 'services',
        services,
        ...paymentData.metadata
      }
    });
  }

  // Get payment history
  async getPaymentHistory(): Promise<any[]> {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(reference: string): Promise<any> {
    try {
      const response = await api.get(`/payments/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      throw error;
    }
  }

  // Refund payment (admin only)
  async refundPayment(reference: string, reason?: string): Promise<any> {
    try {
      const response = await api.post('/admin/payments/refund', {
        reference,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }
}

// Add TypeScript declaration for PaystackPop
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default PaystackService.getInstance();
