// pages/api/create-stripe-connect-account.ts
import { stripe } from '@/utils/stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const account = await stripe.accounts.create({
      type: 'standard',
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/refresh_account_link`,
      return_url: `http://app.localhost:3000/account?account_id=${account.id}&result=success`,
      type: 'account_onboarding',
    });
    res.redirect(accountLink.url);
    res.status(200).json({ account });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default handler;
