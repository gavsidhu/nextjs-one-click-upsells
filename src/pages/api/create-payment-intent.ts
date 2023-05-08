import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { amount, currency, name, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { name, email },
    });

    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Unexpected error');
  }
}
