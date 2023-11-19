import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../services/user.service';
import sendEmail from '../utils/node-mailer';
import { ResetAuthInput, UpdateAuthInput } from '../schema/reset.schema';
import { CreateUserInput } from '../schema/user.schema';
import { AppError } from '../utils/errors';


const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
  const body = req.body;
  try {
    const new_user = await createUser(body);
    res.send(`New user ${new_user.first_name} ${new_user.last_name} created succesfully!`);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.send('Account already exists');
    }
  }
}


const forgortPasswordHandler = async (
  req: Request<{}, {}, ResetAuthInput['body']>, 
  res: Response
) => {
  const { email } = req.body
  const  user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Not Found', 404, `User doesn't exist`, true);
  }

  // create a one time link valid for 30 minutes 
  const auth_reset_secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ 'email': user.email }, auth_reset_secret, { expiresIn: '30m' });
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}`; 
  const dev_link = `http://localhost:8080/api/v1/user/reset/${user._id}/${token}`; 

  sendEmail({
    to: user.email,
    from: 'test@example.com',
    subject: 'Reset Your Password',
    text: `Please follow the link to reset your password: ${dev_link}. Link expires in 30 minutes.`
  });

  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (
  req: Request<ResetAuthInput['params'], {}, UpdateAuthInput['body']>, 
  res: Response
) => {
  const { password } = req.body;
  const { id, token } = req.params;

  const user = await findUserById(id);

  if (!user) {
    throw new AppError('Not Found', 404, `User doesn't exist`, true);
  }

  const auth_reset_secret = process.env.JWT_SECRET + user.password;

  jwt.verify(token, auth_reset_secret, 
    async (err: any) => {
      if (err) return res.status(403).send('Forbidden.');
      user.password = password;
      await user.save();
      res.send('User password has been updated.');
    }
  );
};

export { 
  createUserHandler, 
  forgortPasswordHandler, 
  resetPasswordHandler 
};
