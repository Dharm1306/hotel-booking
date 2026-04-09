# Razorpay Payment Gateway Setup Guide

## Environment Variables Required

Add the following environment variables to your `.env` file:

### Server (.env in QuickStay-FullStack/server)
```
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_SYYV4eatQRuiog
RAZORPAY_KEY_SECRET=q816sP2tw5cH30yijfOtOWec
```

### Client (.env in QuickStay-FullStack/client)
```
# Razorpay Configuration
VITE_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

## How to Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or login to your account
3. Navigate to Settings → API Keys
4. Copy your Key ID and Key Secret
5. Add them to the respective `.env` files

## Payment Flow

1. User clicks "Pay Now" button in My Bookings page
2. Frontend creates a Razorpay order via `/api/bookings/razorpay-payment` endpoint
3. Razorpay checkout modal opens for payment
4. After successful payment, Razorpay returns payment details
5. Frontend sends verification request to `/api/bookings/verify-razorpay` endpoint
6. Server verifies the payment signature and updates booking status
7. Booking is marked as paid upon successful verification

## Removed Files/References

- `stripeWebhooks.js` - Removed from controllers
- Stripe import removed from `server.js`
- Stripe payment route removed

## New Files Added

- `razorpayController.js` - Contains payment and verification logic
- Routes updated in `bookingRoutes.js` to use Razorpay endpoints

## Testing in Development

Make sure to use [Razorpay Test Credentials](https://razorpay.com/docs/payments/payments-gateway/test-credentials/) for testing:
- Use test card numbers provided by Razorpay
- Payment will be processed without actual debit

## Important Notes

- Currency is set to INR (Indian Rupees) as per Razorpay default
- To change currency, update the `verifyRazorpayPayment` function in `razorpayController.js`
- Payment verification happens on both client and server side for security
