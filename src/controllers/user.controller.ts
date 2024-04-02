import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { UserService } from '../services';
import { AppError, log, sendEmail } from '../utils';
import { private_fields } from '../models/user.model';
import { CreateUserInput } from '../schema/user.schema';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';


const DEV_URL = String(process.env.DEV_URL);
const LIVE_URL = String(process.env.LIVE_URL);


const getCurrentUserHandler =  async (_req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(401).send('Please log in first.');
  }
  return res.status(200).send({ user });
}


const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>, 
  res: Response
) => {
  try {
    const body = req.body;
    const user = await UserService.createUser(body);
    return res.status(201).send(`New user ${user.first_name} ${user.last_name} has been created.`);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send('Email already in use.');
    }
  }
}


const forgortPasswordHandler = async (
  req: Request<{}, {}, ResetAuthInput>, 
  res: Response
) => {
  const { email } = req.body;

  const user = await UserService.findUserByEmail(email);
  if (!user) return res.status(404).send('User not found.');

  const user_payload = omit(user.toJSON(), private_fields);

  // create a one time link valid for 30 minutes
  const token = jwt.sign(user_payload, (process.env.SECRET_KEY + user.password), { expiresIn: '30m' });
  const dev_link = `${DEV_URL.trim()}/${user._id}/reset/${token}`;
  const live_link = `${LIVE_URL.trim()}/${user._id}/reset-password/${token}`;

  sendEmail({
    to: email,
    from: 'test@example.com',
    subject: 'Reset Your Password',
    html: `<b>Click <a href="${live_link}">here</a> to reset your password. Link expires in 30 minutes.</b>`
  });

  return res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (
  req: Request<UpdateAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await UserService.findUserById(id);
  if (!user) return res.status(404).send('User not found.');

  jwt.verify(
    token, 
    (String(process.env.SECRET_KEY) + user.password), 
    async (err: any) => {
      if (err) return res.sendStatus(403);
      user.password = password;
      await user.save();
      return res.status(200).send(`Users' password has been updated.`);
    }
  );
};


export default {
  getCurrentUserHandler,
  createUserHandler,
  resetPasswordHandler,
  forgortPasswordHandler,
}
