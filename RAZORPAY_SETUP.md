# Razorpay Payment Integration Setup Guide

## Environment Variables Required

Add the following environment variables to your `server/.env` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## How to Get Razorpay Credentials

1. **Sign up/Login to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com/
   - Sign up for a new account or login to existing account

2. **Get Test Mode Credentials (for development)**
   - Navigate to Settings → API Keys
   - Click on "Generate Test Key" if you haven't already
   - Copy the "Key ID" and "Key Secret"
   - Add them to your `.env` file

3. **Get Live Mode Credentials (for production)**
   - Complete KYC verification in Razorpay dashboard
   - Navigate to Settings → API Keys
   - Click on "Generate Live Key"
   - Copy the "Key ID" and "Key Secret"
   - Update your `.env` file with live credentials

## Installation

The Razorpay package is already added to `package.json`. Just run:

```bash
cd server
npm install
```

## How It Works

1. **Create Order Flow:**
   - User clicks "Pay" on checkout page
   - Frontend calls `/api/v1/payment/create-order` with addressId
   - Backend creates order in database and Razorpay order
   - Returns Razorpay order details to frontend

2. **Payment Flow:**
   - Frontend opens Razorpay checkout modal
   - User completes payment
   - Razorpay returns payment response
   - Frontend calls `/api/v1/payment/verify` with payment details
   - Backend verifies payment signature and updates order status

3. **Order Confirmation:**
   - On successful payment verification:
     - Order status updated to "Paid"
     - Product stock reduced
     - Cart cleared
     - User redirected to orders page

## Testing

### Test Cards (Test Mode)
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### Test UPI IDs
- success@razorpay
- failure@razorpay

## Security Notes

- Never commit `.env` file with actual credentials
- Use test credentials for development
- Switch to live credentials only in production
- Keep your key secret secure and never expose it

## API Endpoints

- `POST /api/v1/payment/create-order` - Create Razorpay order
- `POST /api/v1/payment/verify` - Verify payment
- `GET /api/v1/payment/status/:orderId` - Get payment status

All endpoints require authentication (JWT token).

