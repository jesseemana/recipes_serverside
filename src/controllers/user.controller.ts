import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserService } from '../services';
import { CreateUserInput } from '../schema/user.schema';
import { AppError, log, sendEmail } from '../utils';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';


const getCurrentUserHandler = async (_req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) return res.status(404).send('No user found.');
  return res.status(200).send(user);
}


async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>, 
  res: Response
) {
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


async function forgortPasswordHandler(
  req: Request<{}, {}, ResetAuthInput>, 
  res: Response
) {
  const { email } = req.body;

  const user = await UserService.findUserByEmail(email);
  if (!user) return res.status(401).send('User not found.');

  // create a one time link valid for 30 minutes
  const token = jwt.sign(user.toObject(), (process.env.SECRET_KEY + user.password), { 
    expiresIn: '30m', 
    algorithm: 'RS256', 
  });

  const link = process.env.NODE_ENV === 'production' ? 
    `${process.env.PROD_URL}/${user._id}/reset/${token}` : `${process.env.DEV_URL}/${user._id}/reset/${token}`;

  sendEmail({
    to: email,
    from: 'test@example.com',
    subject: 'Reset Your Password.',
    html: `<b>Click <a href="${link}">here</a> to reset your password. Link expires in 30 minutes.</b>`
  });

  return res.status(200).send(`Password reset link sent to users' email.`);
}


async function resetPasswordHandler(
  req: Request<UpdateAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await UserService.findUserById(id);
  if (!user) return res.status(404).send('User not found.');

  jwt.verify(token, (String(process.env.SECRET_KEY) + user.password), async (err: any) => {
    if (err) return res.sendStatus(403);
    user.password = password;
    await user.save();
    return res.status(200).send(`Users' password updated successfully.`);
  });
}


export default {
  getCurrentUserHandler,
  createUserHandler,
  forgortPasswordHandler,
  resetPasswordHandler,
}
