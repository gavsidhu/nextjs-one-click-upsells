import type { NextApiRequest, NextApiResponse } from 'next';
import { multerMiddleware } from '../../../utils/multerMiddleware';
import { createProduct } from '@/utils/supabase-admin';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      try {
        const uploadMiddleware = multerMiddleware('images');
        uploadMiddleware(req, res, async () => {
          const productData = JSON.parse(req.body.productData);
          const imageData = JSON.parse(req.body.imageData);
          console.log('image data: ', imageData);
          const imageFiles = req.files.map((file) => ({
            buffer: file.buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
          }));

          const result = await createProduct(productData, imageFiles);
          res.send(result);
        });
      } catch (error) {
        return res.status(500).send('Eroor adding product');
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
