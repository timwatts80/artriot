import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const STRIPE_CONFIG = {
  FREQUENCIES_FLOW_PRICE_ID: process.env.STRIPE_FREQUENCIES_FLOW_PRICE_ID!,
  SOMATIC_MOVEMENT_PRICE_ID: process.env.STRIPE_SOMATIC_MOVEMENT_PRICE_ID!,
  MEDITATION_PRICE_ID: process.env.STRIPE_MEDITATION_PRICE_ID!,
  BREATHWORK_PRICE_ID: process.env.STRIPE_BREATHWORK_PRICE_ID!,
} as const;

export const REGISTRATION_LIMITS = {
  'frequencies-flow': 20,
  'somatic-movement': 20,
  'meditation': 15,
  'breathwork': 20,
} as const;