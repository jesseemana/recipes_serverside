import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { UserService } from '../services';
import { AppError, log, sendEmail } from '../utils';
import { private_fields } from '../models/user.model';
import { CreateUserInput } from '../schema/user.schema';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';

const DEV_URL = 'http://localhost:8080/api/v2/users'
const LIVE_URL = 'https://gourmands-portal.vercel.app/reset-password'

const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>, 
  res: Response
) => {
  try {
    const body = req.body;
    const user = await UserService.createUser(body);
    return res.status(201).send(`New user ${user.first_name} ${user.last_name} has been created.`);
  } catch (error: any) {
    if (error.code === 11000) 
      return res.status(409).send('Email already in use.');
      // throw new AppError('Conflict', 409, `Email already in use.`, true);
    return res.status(500).send('Internal server error.');
    // throw new AppError('Internal Server Error', 500, `Something went wrong.`, true);
  }
}


const forgortPasswordHandler = async (
  req: Request<{}, {}, ResetAuthInput>, 
  res: Response
) => {
  const { email } = req.body;

  const user = await UserService.findUserByEmail(email);
  if (!user) return res.status(404).send('User not found.');
    // throw new AppError('Not Found', 404, `User not found.`, true);

  const user_payload = omit(user.toJSON(), private_fields);

  // create a one time link valid for 30 minutes
  const token = jwt.sign(user_payload, (process.env.SECRET_KEY + user.password), { expiresIn: '30m' });
  const dev_link = `${DEV_URL.trim()}/reset/${user._id}/${token}`;
  const live_link = `${LIVE_URL.trim()}/${user._id}/${token}`;
  log.info(`Follow this link to update your password: ${dev_link}`);

  sendEmail({
    to: email,
    from: 'test@example.com',
    subject: 'Reset Your Password',
    html: `<b>Follow this link to reset your password: <a>${live_link}</a>. Link expires in 30 minutes.</b>`
  });

  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (
  req: Request<UpdateAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await UserService.findUserById(id);
  if (!user) return res.status(404).send('User not found.');
    // throw new AppError('Not Found', 404, `User not found.`, true);

  jwt.verify(
    token, 
    (String(process.env.SECRET_KEY) + user.password), 
    async (err: any) => {
      if (err) return res.sendStatus(403);
        // throw new AppError('Forbidden', 403, 'Expired or invalid token detected', true);
      user.password = password;
      await user.save();
      return res.status(200).send(`Users' password has been updated.`);
    }
  );
};


export default {
  createUserHandler,
  resetPasswordHandler,
  forgortPasswordHandler,
}
