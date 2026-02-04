const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Helper function to verify Paystack webhook signature
function verifyWebhookSignature(payload, signature) {
  const secret = process.env.WEBHOOK_SECRET;
  const hash = crypto.createHmac('sha512', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

// Helper function to make Paystack API calls
async function paystackAPI(endpoint, data = null, method = 'GET') {
  try {
    const config = {
      method,
      url: `${PAYSTACK_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Paystack API error:', error.response?.data || error.message);
    throw error;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CarConnect Backend API'
  });
});

// Verify payment
app.get('/api/payments/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify payment with Paystack
    const paystackResponse = await paystackAPI(`/transaction/verify/${reference}`);

    if (paystackResponse.status && paystackResponse.data.status === 'success') {
      // Update payment in Supabase
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          verified_at: new Date().toISOString(),
          gateway_response: paystackResponse.data
        })
        .eq('reference', reference)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ 
          error: 'Failed to update payment status',
          details: error.message 
        });
      }

      return res.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: data[0],
        paystackData: paystackResponse.data
      });
    } else {
      // Update payment as failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          gateway_response: paystackResponse.data
        })
        .eq('reference', reference);

      return res.status(400).json({
        status: 'failed',
        message: 'Payment verification failed',
        data: paystackResponse.data
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Refund payment (admin only)
app.post('/api/admin/payments/refund', async (req, res) => {
  try {
    const { reference, reason } = req.body;

    if (!reference) {
      return res.status(400).json({
        error: 'Reference is required'
      });
    }

    // Get payment details from Supabase
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single();

    if (fetchError || !payment) {
      return res.status(404).json({
        error: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        error: 'Only completed payments can be refunded'
      });
    }

    // Process refund with Paystack
    const refundResponse = await paystackAPI('/refund', {
      transaction: reference,
      amount: Math.round(payment.amount * 100), // Convert to kobo/cents
      reason: reason || 'Admin refund'
    }, 'POST');

    if (refundResponse.status) {
      // Update payment status in Supabase
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          gateway_response: {
            ...payment.gateway_response,
            refund: refundResponse.data,
            refunded_at: new Date().toISOString(),
            refund_reason: reason
          }
        })
        .eq('reference', reference)
        .select();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return res.status(500).json({
          error: 'Failed to update payment status',
          details: updateError.message
        });
      }

      return res.json({
        status: 'success',
        message: 'Refund processed successfully',
        data: updatedPayment[0],
        refundData: refundResponse.data
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: 'Refund failed',
        data: refundResponse
      });
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Paystack webhook handler
app.post('/api/webhooks/paystack', (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const data = req.body.data;

    console.log(`Paystack webhook received: ${event}`);

    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        handleSuccessfulPayment(data);
        break;
      
      case 'charge.failed':
        handleFailedPayment(data);
        break;
      
      case 'refund.success':
        handleSuccessfulRefund(data);
        break;
      
      case 'refund.failed':
        handleFailedRefund(data);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    // Respond to Paystack immediately
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook event handlers
async function handleSuccessfulPayment(data) {
  try {
    const { reference, amount, customer, metadata } = data;

    // Update payment in Supabase
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        verified_at: new Date().toISOString(),
        gateway_response: data
      })
      .eq('reference', reference);

    if (error) {
      console.error('Error updating successful payment:', error);
    } else {
      console.log(`Payment ${reference} marked as completed`);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(data) {
  try {
    const { reference } = data;

    // Update payment in Supabase
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        gateway_response: data
      })
      .eq('reference', reference);

    if (error) {
      console.error('Error updating failed payment:', error);
    } else {
      console.log(`Payment ${reference} marked as failed`);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

async function handleSuccessfulRefund(data) {
  try {
    const { transaction } = data;

    // Update payment in Supabase
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        gateway_response: {
          refund: data,
          refunded_at: new Date().toISOString()
        }
      })
      .eq('reference', transaction);

    if (error) {
      console.error('Error updating refund:', error);
    } else {
      console.log(`Refund for ${transaction} processed successfully`);
    }
  } catch (error) {
    console.error('Error handling successful refund:', error);
  }
}

async function handleFailedRefund(data) {
  try {
    const { transaction } = data;

    console.error(`Refund failed for transaction ${transaction}:`, data);
    
    // Log the failed refund - you might want to notify admin
    // Payment status remains 'completed' if refund fails
  } catch (error) {
    console.error('Error handling failed refund:', error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CarConnect Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/api/webhooks/paystack`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
