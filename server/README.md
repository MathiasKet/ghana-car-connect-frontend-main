# CarConnect Backend API Server

Backend API server for CarConnect Ghana with Paystack integration, webhooks, and payment processing.

## Features

- ✅ Paystack payment verification
- ✅ Payment refunds (admin only)
- ✅ Paystack webhook handling
- ✅ Supabase database integration
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Webhook signature verification
- ✅ Error handling and logging

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your actual credentials:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Payment Verification
- `GET /api/payments/verify/:reference` - Verify payment with Paystack

### Admin Operations
- `POST /api/admin/payments/refund` - Process payment refund

### Webhooks
- `POST /api/webhooks/paystack` - Paystack webhook handler

## Paystack Webhook Setup

1. Go to your Paystack dashboard
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
4. For development, use: `http://localhost:3001/api/webhooks/paystack`
5. Set webhook secret key in your `.env` file

## Supported Webhook Events

- `charge.success` - Payment completed successfully
- `charge.failed` - Payment failed
- `refund.success` - Refund processed successfully
- `refund.failed` - Refund failed

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Webhook Signature Verification**: Ensures webhooks are from Paystack
- **Environment Variables**: Sensitive data not exposed

## Error Handling

- Comprehensive error logging
- Graceful error responses
- Development vs production error details
- Database transaction safety

## Integration with Frontend

The backend integrates seamlessly with the frontend AdminPayments component:

1. **Payment Verification**: Frontend calls `/api/payments/verify/:reference`
2. **Refund Processing**: Frontend calls `/api/admin/payments/refund`
3. **Real-time Updates**: Webhooks automatically update payment status

## Monitoring

- Health check endpoint for monitoring
- Structured error logging
- Webhook event tracking
- Payment status updates

## Deployment

### Environment Variables Required
- `NODE_ENV` (development/production)
- `PORT` (server port)
- `PAYSTACK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `WEBHOOK_SECRET`
- `FRONTEND_URL`

### Production Considerations
- Use HTTPS for webhook URLs
- Set up proper logging
- Monitor webhook failures
- Implement retry logic for failed operations
- Set up database backups

## Troubleshooting

### Common Issues

1. **Webhook not working**: Check webhook URL and signature
2. **Payment verification failing**: Verify Paystack API keys
3. **Database errors**: Check Supabase connection and permissions
4. **CORS errors**: Verify FRONTEND_URL configuration

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## License

MIT License
