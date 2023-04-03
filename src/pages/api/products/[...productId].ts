import type { NextApiRequest, NextApiResponse } from 'next';
import { multerMiddleware } from '../../../utils/multerMiddleware';
import { updateProduct } from '@/utils/supabase-admin';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest & { files: Express.Multer.File[] },
  res: NextApiResponse
) {
  const {
    method,
  } = req;

  console.log(method)

  switch (method) {
    case 'GET':
      // Get a specific product
      break;
    case 'PUT':
      // Update a specific product
      try {
        const uploadMiddleware = multerMiddleware('images');
        uploadMiddleware(req, res, async () => {
          const productData = JSON.parse(req.body.productData);
          const imageData = JSON.parse(req.body.imageData);
          const productId = JSON.parse(req.body.productId);
          console.log('image data: ', imageData);
          const imageFiles = req.files.map((file) => ({
            buffer: file.buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
          }));

          const result = await updateProduct(productData, imageFiles, parseInt(productId));
          res.status(200).send(result);
        });
      } catch (error) {
        return res.status(500).send('Eroor adding product');
      }
      break;
    case 'DELETE':
      // Delete a specific product
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
