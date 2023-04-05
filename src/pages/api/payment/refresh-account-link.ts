// pages/api/refresh_account_link.ts
import { stripe } from '@/utils/stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { account_id: accountId } = req.query;
      const accountLinks = await stripe.accountLinks.create({
        account: accountId as string,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/account/reauth?account_id=${accountId}`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?account_id=${accountId}`,
        type: 'account_onboarding',
      });
      res.redirect(accountLinks.url);
    } catch (error) {
      console.error('Error creating account link:', error);
      res.status(500).json({ error: 'Failed to create account link.' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
