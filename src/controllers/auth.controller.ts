import { Request, Response } from 'express';
import { AuthService, UserService } from '../services';
import { Jwt, AppError, log } from '../utils';
import { CreateSessionInput } from '../schema/user.schema';


async function findSessionsHandler(_req: Request, res: Response) {
  const all_sessions = await AuthService.findAllSessions();
  return res.status(200).send(all_sessions);
}


async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>, 
  res: Response
) {
  const { email, password } = req.body;
  
  const user = await UserService.findUserByEmail(email);
  if (!user) throw new AppError('Unauthorized', 401, 'Email is incorrect.', true);
  if (!user.verifyPassword(password)) {
    return res.status(401).send('Incorrect password.');
  }

  let payload: any = {}
  payload['ip'] = req.ip;
  payload['user_agent'] = req.headers['user-agent'];

  Object.freeze(payload);

  const session = await AuthService.createSession({ ...payload, user: user._id });
  const access_token = AuthService.signAccessToken(user);
  const refresh_token = await AuthService.signRefreshToken(session);

  res.cookie('refreshToken', refresh_token, {
    path: '/',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: 'strict', // forbids cross-site access
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).send({ access_token });
}


async function refreshTokenHandler(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.refreshToken) 
    return res.status(401).send('Refresh token found.');

  const decoded = Jwt.verifyToken<{ session: string }>(
    String(cookies.refreshToken), 
    String(process.env.REFRESH_TOKEN_PUBLIC_KEY)
  );
  if (!decoded) return res.status(403).send('Refresh token found.');

  const session = await AuthService.findSessionById(decoded.session);
  if (!session) return res.status(401).send('Session not found.');
  if (!session.valid) {
    return res.status(401).send('Session is already destroyed.');
  }

  const user = await UserService.findUserById(String(session.user));
  if (!user) return res.status(404).send('User not found.');

  const access_token = AuthService.signAccessToken(user);

  return res.status(200).send({ access_token });
}


async function destroySessionHandler(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.refreshToken)
    return res.status(401).send('Refresh token found.');
  
  const user = res.locals.user;

  const decoded = Jwt.verifyToken<{ session: string }>(
    String(cookies.refreshToken), 
    String(process.env.REFRESH_TOKEN_PUBLIC_KEY)
  );
  if (!decoded) return res.status(403).send('Refresh token found.');

  const session = await AuthService.findSessionById(decoded.session);
  if (!session) return res.status(401).send('Session not found.');
  if (!session.valid) {
    return res.status(401).send('Session is already destroyed.');
  }

  if (String(session.user) !== String(user._id)) return res.sendStatus(401);

  const destroyed = await AuthService.destroySession({ _id: session._id }, { valid: false });
  if (!destroyed) return res.status(400).send('Failed to destroy session.')

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  return res.status(200).send('User loged out successfully.');
}


export default {
  createSessionHandler,
  refreshTokenHandler,
  destroySessionHandler,
  findSessionsHandler,
}
