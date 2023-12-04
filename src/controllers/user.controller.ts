import jwt from 'jsonwebtoken';
import sendEmail from '../utils/node-mailer';
import { Request, Response } from 'express';
import { createUser, findUserByEmail, findUserById } from '../services/user.service';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';
import { CreateUserInput } from '../schema/user.schema';
import { AppError } from '../utils/errors';
import { omit }from 'lodash';
import { private_fields } from '../models/user.model';


export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>, 
  res: Response
) => {
  const body = req.body;
  try {
    const new_user = await createUser(body);
    res.status(201).send(`New user ${new_user.first_name} ${new_user.last_name} created succesfully!`);
  } catch (error: any) {
    if (error.code === 11000) 
      throw new AppError('Conflict', 409, `Email already in use.`, true);
    throw new AppError('Internal Server Error', 500, `Something went wr0ng.`, true);
  }
}


export const forgortPasswordHandler = async (
  req: Request<{}, {}, ResetAuthInput>, 
  res: Response
) => {
  const { email } = req.body;

  const  user = await findUserByEmail(email);

  if (!user) throw new AppError('Not Found', 404, `User doesn't exist`, true);

  const reset_secret = process.env.JWT_SECRET + user.password;
  const user_payload = omit(user.toJSON(), private_fields);
  
  const token = jwt.sign(user_payload, reset_secret, { expiresIn: '30m' }); // One time link valid for 30 minutes
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}`; 
  const dev_link = `http://localhost:8080/api/v1/user/reset/${user._id}/${token}`; 

  sendEmail({
    to: email,
    from: 'test@example.com',
    subject: 'Reset Your Password',
    html: `<b>Please follow the link to reset your password: <a>${dev_link}</a>. Link expires in 30 minutes.</b>`
  });

  res.status(200).send(`Password reset link sent to users' email.`);
};


export const resetPasswordHandler = async (
  req: Request<UpdateAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) => {
  const { password } = req.body;
  const { id, token } = req.params;

  const user = await findUserById(id);

  if (!user) throw new AppError('Not Found', 404, `User doesn't exist`, true);

  const reset_secret = process.env.JWT_SECRET + user.password;

  jwt.verify(token, reset_secret, 
    async (err: any) => {
      if (err) throw new AppError('Forbidden', 403, 'Expired or invalid token detected', true);
      user.password = password;
      await user.save();
      res.send(`Users' password has been updated.`);
    }
  );
};
