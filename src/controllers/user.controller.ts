import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../services/user.service';
import sendEmail from '../utils/node-mailer';
import config from 'config';
import { ResetAuthInput } from '../schema/reset.schema';
import { CreateUserInput } from '../schema/user.schema';


const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
  const body = req.body
  try {
    const new_user = await createUser(body)
    res.send(`New user ${new_user.first_name} ${new_user.last_name} created succesfully!`)
  } catch (error: any) {
    if (error.code === 11000) {
      return res.send('Account already exists')
    }
  }
}


const forgortPasswordHandler = async (req: Request<{}, {}, ResetAuthInput['body']>, res: Response) => {
  const user = await findUserByEmail(req.body.email);

  if (!user) {
    return res.status(401).json(`User doesn't exist.`);
  }

  // create a one time link valid for 30 minutes 
  const auth_reset_secret = config.get<string>('passwordSecret') + user.password;
  const token = jwt.sign({ 'email': user.email }, auth_reset_secret, { expiresIn: '30m' });
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}`; 
  const dev_link = `http://localhost:8080/api/v1/user/reset/${user._id}/${token}`; 

  sendEmail({
    to: user.email,
    from: config.get<string>('user'),
    subject: 'RESET YOUR PASSWORD',
    text: `Please follow the link to reset your password: ${dev_link}. Link expires in 30 minutes.`
  });

  res.status(200).send(`Password reset link sent to users' email.`);
};


const resetPasswordHandler = async (req: Request<ResetAuthInput['params'], {}, ResetAuthInput['body']>, res: Response) => {
  const { id, token } = req.params;
  const password = req.body.password;

  const user = await findUserById(id);

  if (!user) {
    return res.status(401).send(`User doesn't exist.`);
  }

  const auth_reset_secret = config.get<string>('passwordSecret') + user.password;

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
