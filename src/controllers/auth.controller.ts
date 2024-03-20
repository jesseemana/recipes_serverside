import { Request, Response } from 'express';
import { Jwt, AppError } from '../utils';
import { AuthService, UserService } from '../services';
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
  if (!user) return res.status(401).send('User not found.');
  if (!user.verifyPassword(password)) 
    return res.status(401).send('Incorrect Password.');

  const session = await AuthService.createSession({ userId: String(user._id) });

  // Access token payload can also be stuff like user agent, ip and other unique things like that
  const access_token = AuthService.signAccessToken(user, session);
  const refresh_token = AuthService.signRefreshToken(session);

  res.cookie('refreshToken', refresh_token, {
    path: '/',
    secure: false, // set to true in prod
    httpOnly: true,
    sameSite: 'strict', // forbids cross-site access
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).send({ user, access_token });
};


async function refreshTokenHandler(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.refresh_token) 
    return res.status(401).send('Refresh token found.');
    // throw new AppError('Unauthorized', 404, 'Refresh token found', true);

  const refresh_token = String(cookies.refresh_token);
  const public_key = String(process.env.REFRESH_TOKEN_PUBLIC_KEY);

  const decoded = Jwt.verifyToken<{ session: string }>(refresh_token, public_key);
  if (!decoded) return res.status(403).send('Refresh token found.');
    // throw new AppError('Forbidden', 403, 'Refresh token found.', true);

  const session = await AuthService.findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send('Session not found or is invalid.');
    // throw new AppError('Unauthorized', 401, 'Session not found or is invalid.', true);
  }

  const user = await UserService.findUserById(String(session.user));
  if (!user) return res.status(404).send('User not found.');

  const access_token = AuthService.signAccessToken(user, session);

  return res.status(200).send({ access_token });
};


async function destroySessionHandler(_req: Request, res: Response) {
  const user = String(res.locals.user._id);
  const session_id = String(res.locals.user.session._id);

  const session = await AuthService.findSessionById(session_id);
  if (!session || !session.valid)
    return res.status(401).send('Session not found or is invalid.');
    // throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);

  if (String(session.user) !== user) return res.sendStatus(401);

  await AuthService.destroySession({ _id: session._id }, { valid: false });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  return res.status(200).send('User loged out successfully.');
}

export default {
  findSessionsHandler,
  createSessionHandler,
  refreshTokenHandler,
  destroySessionHandler,
}
