import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 } from 'uuid';

const uuid = v4;

export const upload = multer({
  storage: multer.diskStorage({
    filename: (_req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      let ext = path.extname(file.originalname);
      cb(null, `IMG_${Date.now()}_${uuid()}${ext}`);
    }
  }),

  fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error('Choose a supported file type.'));
      return;
    }
    cb(null, true);
  }
});
