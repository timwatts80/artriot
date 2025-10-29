# Stripe Integration Setup Guide

## 1. Stripe Dashboard Setup

### Create Products and Prices
1. Log into your Stripe Dashboard
2. Go to Products → Create Product for each event:

#### Product 1: Frequencies + Flow
- **Name**: Frequencies + Flow: Creative Expression
- **Description**: Live music guided creative expression session
- **Price**: $55 USD (one-time payment)
- **Copy the Price ID** (starts with `price_`) and update `FREQUENCIES_FLOW_PRICE_ID` in `/src/lib/stripe.ts`

#### Product 2: Somatic Movement & Art  
- **Name**: Somatic Movement & Art
- **Description**: Mindful movement and artistic expression session
- **Price**: $55 USD (one-time payment)
- **Copy the Price ID** and update `SOMATIC_MOVEMENT_PRICE_ID` in `/src/lib/stripe.ts`

#### Product 3: Meditation & Creative Expression
- **Name**: Meditation & Creative Expression  
- **Description**: Deep meditation and creative insight session
- **Price**: $55 USD (one-time payment)
- **Copy the Price ID** and update `MEDITATION_PRICE_ID` in `/src/lib/stripe.ts`

## 2. Environment Variables

### Get Your API Keys
1. Go to Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### Update .env.local
Replace the placeholder values in your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 3. Webhook Setup

### Create Webhook Endpoint
1. Go to Developers → Webhooks → Add endpoint
2. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
3. **Events to send**:
   - `checkout.session.completed`
4. Copy the **Signing Secret** (starts with `whsec_`) and update `STRIPE_WEBHOOK_SECRET`

### For Local Development
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Use the webhook secret from the CLI output

## 4. Testing

### Test Cards (Test Mode)
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Flow
1. Visit `/register/in-person`
2. Select an event
3. Fill out registration form
4. Use test card for payment
5. Verify success page and emails

## 5. Production Deployment

### Switch to Live Mode
1. Get live API keys from Stripe Dashboard (switch from Test to Live)
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Test with real payment methods

### Important Notes
- Always test webhook functionality before going live
- Monitor webhook delivery in Stripe Dashboard
- Set up proper error handling and logging
- Consider implementing idempotency for webhook processing

## 6. Registration Limits

The system includes built-in capacity limits:
- Frequencies + Flow: 20 participants
- Somatic Movement: 15 participants  
- Meditation: 25 participants

To update limits, modify `/src/lib/stripe.ts`:

```typescript
export const REGISTRATION_LIMITS = {
  'frequencies-flow': 20,
  'somatic-movement': 15,
  'meditation': 25,
} as const;
```

## 7. Database Integration (Optional)

Currently, registration data is stored in Stripe metadata and sent via email. For production, consider:
- Adding a database to track registrations
- Implementing real-time capacity checking
- Creating an admin dashboard for event management
- Adding participant check-in functionality

## Support

For Stripe integration issues:
- Check Stripe Dashboard logs
- Review webhook delivery status
- Test with Stripe CLI in development
- Contact Stripe support for payment processing questions