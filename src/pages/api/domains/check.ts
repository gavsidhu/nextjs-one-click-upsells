import { supabaseAdmin } from '@/utils/supabase-admin';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

// This endpoint checks if a domain still has its nameservers/record configured correctly.
// To request access to a domain that belongs to another team, you need to use the
// `/verify` endpoint: https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain
// You can see an implementation example here: https://github.com/vercel/examples/tree/main/solutions/domains-api

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, subdomain = false } = req.query;

  if (Array.isArray(domain)) {
    return res
      .status(400)
      .end('Bad request. domain parameter cannot be an array.');
  }

  try {
    if (subdomain) {
      const sub = (domain as string).replace(/[^a-zA-Z0-9/-]+/g, '');

      const { data, error } = await supabaseAdmin
        .from('shops') // Replace 'site' with your table name in Supabase
        .select('subdomain')
        .eq('subdomain', sub)
        .single();

      if (error) {
        console.error('Error fetching shop:', error);
        return res.status(500).end(error.message);
      }

      const available = data === null && sub.length !== 0;

      return res.status(200).json(available);
    }

    const response = await axios.get(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;

    const valid = data?.configuredBy ? true : false;

    return res.status(200).json(valid);
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).end(errorMessage);
  }
}
