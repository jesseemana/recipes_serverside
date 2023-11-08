import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserById } from '../services/user.service';
// const transporter = require('../utils/nodeMailer')


const sendLinkHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json('Please provide an email adress.');

  const user = await findUserByEmail(email).exec();
  if (!user) return res.status(401).json(`User doesn't exist.`);

  // create a one time link valid for 30 minutes 
  const SECRET_TOKEN = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ 'email': user.email }, SECRET_TOKEN, { expiresIn: '30m' });
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}`; // FOR FRONTEND
  const dev_link = `http://localhost:8080/api/v1/reset/${user._id}/${token}`; // FOR DEV MODE(POSTMAN)
  console.log(link);

  // NODEMAILER SETUP


  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (req: Request, res: Response) => {
  const { id, token } = req.params;

  if (!id || !token || !req.body.password) {
    return res.status(400).send('Please provide user id, token and password!');
  }

  const user = await findUserById(id);
  if (!user) return res.status(401).send(`User doesn't exist.`);

  const SECRET_TOKEN = process.env.JWT_SECRET + user.password;
  const new_password = bcrypt.hashSync(req.body.password, 10);

  jwt.verify(token, SECRET_TOKEN, 
    async (err) => {
      if (err) return res.status(403).send('Forbidden.');
      user.password = new_password;
      await user.save();
      res.status(200).send('User password has been updated.');
    }
  );
};


export { sendLinkHandler, resetPasswordHandler };
