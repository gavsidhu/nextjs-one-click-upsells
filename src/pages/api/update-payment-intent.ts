import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { paymentIntentId, amount, name, email } = req.body;

  const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
    amount,
  });

  res.status(200).json(paymentIntent);
}
