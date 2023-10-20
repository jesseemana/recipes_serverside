// import { Express, Request, Response } from 'express'
const cloudinary = require('./cloudinary');
const verifyToken = require('../middleware/auth');

const routes = (app) => {
  app.use('/api/v1/auth', require('../routes/auth'));
  app.use('/api/v1/recipes', require('../routes/recipes'));
  app.use('/api/v1/bookmarks', require('../routes/bookmarks'));
  app.use('/api/v1/reset', require('../routes/resetPassword'));
  app.use('/api/v1/reviews', require('../routes/reviews'));

  // WHEN UPLOADING THE PICTURE SEPARATELY FROM THE FORMDATA 
  app.post('/api/v1/upload', verifyToken, async (req, res) => {
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