import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const STRIPE_CONFIG = {
  FREQUENCIES_FLOW_PRICE_ID: 'price_1SNaPGGFD0K8TqkA5pSktiIy', // Live price ID
  SOMATIC_MOVEMENT_PRICE_ID: 'price_1SNaRPGFD0K8TqkAqt9pMtEb', // Replace with actual price ID
  MEDITATION_PRICE_ID: 'price_1SNaSSGFD0K8TqkAnH11uc4S', // Replace with actual price ID
} as const;

export const REGISTRATION_LIMITS = {
  'frequencies-flow': 20,
  'somatic-movement': 20,
  'meditation': 15,
} as const;