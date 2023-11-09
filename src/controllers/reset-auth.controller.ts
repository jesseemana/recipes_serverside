import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserById } from '../services/user.service';
import sendEmail from '../utils/node-mailer';
import config from 'config';
import { ResetAuthInput } from '../schema/reset.schema';
import log from '../utils/logger';


const sendLinkHandler = async (req: Request<{}, {}, ResetAuthInput['body']>, res: Response) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json(`User doesn't exist.`);

  // create a one time link valid for 30 minutes 
  const REST_AUTH_TOKEN = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ 'email': user.email }, REST_AUTH_TOKEN, { expiresIn: '30m' });
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}`; 
  const dev_link = `http://localhost:8080/api/v1/reset/${user._id}/${token}`; 
  log.info(dev_link);

  sendEmail({
    to: user.email,
    from: config.get<string>('user'),
    subject: 'RESET YOUR PASSWORD',
    text: `Please follow the link to reset your password: ${link}. Link expires in 30 minutes.`
  })

  log.debug(`Password reset email sent to ${email}`)

  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (req: Request<ResetAuthInput['params'], {}, ResetAuthInput['body']>, res: Response) => {
  const { id, token } = req.params;
  const password = req.body.password;
  const user = await findUserById(id);

  if (!user) return res.status(401).send(`User doesn't exist.`);

  const REST_AUTH_TOKEN = process.env.JWT_SECRET + user.password;

  const salt = bcrypt.genSaltSync(config.get<number>('saltWorkFactor'));
  const new_password = bcrypt.hashSync(password, salt);

  jwt.verify(token, REST_AUTH_TOKEN, 
    async (err: any) => {
      if (err) return res.status(403).send('Forbidden.');
      user.password = new_password;
      await user.save();
      res.status(200).send('User password has been updated.');
    }
  );
};

export { sendLinkHandler, resetPasswordHandler };
