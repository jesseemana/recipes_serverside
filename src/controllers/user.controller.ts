import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { UserService } from '../services';
import { AppError, sendEmail } from '../utils';
import { private_fields } from '../models/user.model';
import { CreateUserInput } from '../schema/user.schema';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';


const DEV_URL = 'http://localhost:8080/api/v2/users/reset'
const LIVE_URL = 'https://gourmands-portal.vercel.app/reset-password'


const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>, 
  res: Response
) => {
  const body = req.body;
  try {
    const new_user = await UserService.createUser(body);
    return res.status(201).send(`New user ${new_user.first_name} ${new_user.last_name} created succesfully.`);
  } catch (error: any) {
    if (error.code === 11000) 
      return res.status(409).send('Email already in use.')
      // throw new AppError('Conflict', 409, `Email already in use.`, true);
    return res.status(500).send('Internal server error.')
    // throw new AppError('Internal Server Error', 500, `Something went wrong.`, true);
  }
}


const forgortPasswordHandler = async (
  req: Request<{}, {}, ResetAuthInput>, 
  res: Response
) => {
  const { email } = req.body;
  const user = await UserService.findUserByEmail(email);
  if (!user) return res.status(404).send('User Not Found.')
  // if (!user) throw new AppError('Not Found', 404, `User Not Found.`, true);

  const reset_secret = process.env.SECRET_KEY + user.password;
  const user_payload = omit(user.toJSON(), private_fields);
  // create a one time link valid for 30mitues
  const token = jwt.sign(user_payload, reset_secret, { expiresIn: '30m' }); 
  const live_link = `${LIVE_URL}/${user._id}/${token}`; 
  const dev_link = `${DEV_URL}/${user._id}/${token}`; 

  sendEmail({
    to: email,
    from: 'test@example.com',
    subject: 'Reset Your Password',
    html: `<b>Please follow the link to reset your password: <a>${dev_link}</a>. Link expires in 30 minutes.</b>`
  });

  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (
  req: Request<UpdateAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) => {
  const { id, token } = req.params;
  const { new_password } = req.body;

  const user = await UserService.findUserById(id);
  if (!user) return res.status(404).send('User Not Found.')
  // if (!user) throw new AppError('Not Found', 404, `User Not Found.`, true);

  jwt.verify(
    token, 
    process.env.SECRET_KEY + user.password, 
    async (err: any) => {
      if (err) return res.sendStatus(403)
      // if (err) throw new AppError('Forbidden', 403, 'Expired or invalid token detected', true);
      user.password = new_password;
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
