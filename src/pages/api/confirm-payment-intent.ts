import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentIntentId } = req.body;

  const result = await stripe.paymentIntents.confirm(paymentIntentId);

  res.status(200).json(result);
}
