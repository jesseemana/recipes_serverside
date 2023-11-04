import { Express, Request, Response } from 'express'
import cloudinary from './cloudinary';
import verifyToken from '../middleware/auth';

const routes = (app: Express) => {
  app.use('/api/v1/auth', require('../routes/auth'));
  app.use('/api/v1/recipes', require('../routes/recipes'));
  app.use('/api/v1/bookmarks', require('../routes/bookmarks'));
  app.use('/api/v1/reset', require('../routes/resetPassword'));

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

module.exports = routes;    