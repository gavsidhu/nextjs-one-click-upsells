import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const multerMiddleware = (field: string) => {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    upload.array(field)(req as any, res as any, (err: any) => {
      if (err) {
        res
          .status(400)
          .json({ message: 'Error uploading files', error: err.message });
        return;
      }
      next();
    });
  };
};
