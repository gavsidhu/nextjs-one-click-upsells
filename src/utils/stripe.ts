import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.NODE_ENV === 'development'
    ? (process.env.STRIPE_SECRET_KEY_DEV as string)
    : (process.env.STRIPE_SECRET_KEY as string),
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'One Page Shop',
      version: '0.1.0',
    },
  }
);
