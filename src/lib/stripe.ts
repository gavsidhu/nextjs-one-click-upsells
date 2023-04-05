import { PaymentIntent, PaymentMethodResult } from '@stripe/stripe-js';
import axios from 'axios';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Create a PaymentIntent for the initial purchase
export const createPaymentIntent = async (paymentMethodId: string) => {
  const paymentIntent = await axios.post(
    'http://localhost:3000/api/create-payment-intent',
    {
      amount: 1000,
      currency: 'usd',
      name: 'Joa Shmoe',
      email: 'JoaShmoe@3mail.com',
      paymentMethodId,
    }
  );

  return paymentIntent.data;
};

export const updatePaymentIntent = async (
  paymentIntentId: string,
  amount: number
) => {
  const paymentIntent = await axios.post(
    'http://localhost:3000/api/update-payment-intent',
    {
      paymentIntentId,
      amount,
    }
  );

  return paymentIntent.data;
};

// Add an additional product to the PaymentIntent and confirm it
export const confirmPaymentIntent = async (paymentIntentId: string) => {
  const result = await axios.post(
    'http://localhost:3000/api/confirm-payment-intent',
    {
      paymentIntentId,
    }
  );

  return result.data;
};
