import { Express, Request, Response } from 'express'
import cloudinary from './cloudinary';
import verifyToken from '../middleware/auth.middleware';

import authRouter from '../routes/auth.route'
import recipesRoute from '../routes/recipes.route'
import bookmarksRoute from '../routes/bookmarks.route'
import resetRoute from '../routes/reset.route'

const routes = (app: Express) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/recipes', recipesRoute);
  app.use('/api/v1/bookmarks', bookmarksRoute);
  app.use('/api/v1/reset', resetRoute);

  // WHEN UPLOADING THE PICTURE SEPARATELY FROM THE FORMDATA 
  app.post('/api/v1/upload', verifyToken, async (req: Request, res: Response) => {
    const response = await cloudinary.uploader.upload(req.body.data, {
      upload_preset: 'recipes' // CONFIGURE UPLOAD_PRESET IN CLOUDINARY
    });
    res.status(200).json({
      id: response.public_id,
      url: response.secure_url,
    });
  });
};

export default routes
