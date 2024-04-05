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
  if (!user) { // return res.status(401).send('Email is incorrect.');
    throw new AppError('Unauthorized', 401, 'Email is incorrect.', true);
  }
  if (!user.verifyPassword(password)) {
    return res.status(401).send('Incorrect password.');
  }

  let payload: any = {}
  payload['ip'] = req.ip;
  payload['user_agent'] = req.headers['user-agent'];
  Object.freeze(payload);

  log.info(`Session object: ${{ ...payload, user: String(user._id) }}`);

  const session = await AuthService.createSession({ ...payload, user: String(user._id) });

  const access_token = await AuthService.signAccessToken(user, session);
  const refresh_token = await AuthService.signRefreshToken(session);

  res.cookie('refreshToken', refresh_token, {
    path: '/',
    secure: false, // set to true in prod
    httpOnly: true,
    sameSite: 'strict', // forbids cross-site access
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).send({ access_token });
};


async function refreshTokenHandler(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.refresh_token) {
    return res.status(401).send('Refresh token found.');
  }

  const decoded = Jwt.verifyToken<{ session: string }>(
    String(cookies.refresh_token), 
    String(process.env.REFRESH_TOKEN_PUBLIC_KEY)
  );
  
  if (!decoded) return res.status(403).send('Refresh token found.');

  const session = await AuthService.findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send('Session not found or is invalid.');
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
  if (!session || !session.valid) {
    return res.status(401).send('Session not found or is invalid.');
  }

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
