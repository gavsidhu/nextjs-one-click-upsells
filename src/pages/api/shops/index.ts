import type { NextApiRequest, NextApiResponse } from 'next';
import { multerMiddleware } from '../../../utils/multerMiddleware';
import { createShop } from '@/utils/supabase-admin';

export default async function handler(
  req: NextApiRequest & { files: Express.Multer.File[] },
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all products
      break;
    case 'POST':
      const { shopData } = req.body;
      try {
        const result = await createShop(shopData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send('Error creating shop: ');
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
