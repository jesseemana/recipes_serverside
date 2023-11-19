import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { findUserByEmail, findUserById } from '../services/user.service';
import { createSession, findSessionById, signAccessToken, signRefreshToken, updateSession } from '../services/auth.service';
import { CreateSessionInput } from '../schema/user.schema';


export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>, 
  res: Response
) => {
  const { email, password } = req.body;
  
  const user = await findUserByEmail(email);

  if (!user || !user.verifyPassword(password)) {
    return res.send('Invalid user credentials given');
  }

  const session = await createSession({ userId: String(user._id) });

  const access_token = signAccessToken(user, session);

  const refresh_token = signRefreshToken(session);

  res.cookie('refresh_token', refresh_token, {
    maxAge: 30*24*60*60*1000, // 30 days
    httpOnly: true,
    secure: false,
    sameSite: 'strict', // cross-site access
    path: '/',
  });

  res.status(200).send({ user, access_token });
};


export const refreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) {
    return res.status(401).send('Unauthorized');
  }

  const refresh_token = cookies.refresh_token as string;

  const decoded = verifyToken<{ session: string }>(refresh_token, 'refreshTokenPublicKey');
  if (!decoded) {
    return res.status(401).send(`Couldn't find refresh token`);
  }

  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send('Session is not found or is invalid');
  }

  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(401).send('Could not find user');
  }

  const access_token = signAccessToken(user, session);

  res.status(200).send({ access_token });
};


export const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) {
    return res.sendStatus(204); // No cookie, we're good either way
  }; 

  const sessionId = res.locals.user.session._id as string;

  const session = await findSessionById(sessionId);
  if (!session || !session.valid) {
    return res.status(401).send('Session is not found or is invalid');
  }

  await updateSession({ _id: session._id }, { valid: false });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  res.send('User loged out successfully.');
};
