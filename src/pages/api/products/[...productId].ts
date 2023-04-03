import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { productId },
  } = req;

  switch (method) {
    case 'GET':
      // Get a specific product
      break;
    case 'PUT':
      // Update a specific product
      break;
    case 'DELETE':
      // Delete a specific product
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
