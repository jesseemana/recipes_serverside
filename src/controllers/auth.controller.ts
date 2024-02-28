import { Request, Response } from 'express';
import { Jwt, AppError } from '../utils';
import { AuthService, UserService } from '../services';
import { CreateSessionInput } from '../schema/user.schema';


async function findSessionsHandler(_: Request, res: Response) {
  const all_sessions = await AuthService.findAllSessions();
  res.status(200).send(all_sessions);
}


const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>, 
  res: Response
) => {
  const { email, password } = req.body;
  
  const user = await UserService.findUserByEmail(email).select('-password');
  if (!user) return res.status(401).send('User Not Found.');
  if (!user.verifyPassword(password)) return res.status(401).send('Incorrect Password.');

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

  res.status(200).send({ user, access_token });
};


const refreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.refresh_token) {
    return res.status(401).send('Refresh Token Not Found.');
    // throw new AppError('Unauthorized', 404, 'Refresh Token Not Found', true);
  }

  const refresh_token = String(cookies.refresh_token);

  const decoded = Jwt.verifyToken<{ session: string }>(refresh_token, String(process.env.REFRESH_TOKEN_PUBLIC_KEY));
  if (!decoded) {
    return res.status(403).send('Refresh Token Not Found.');
    // throw new AppError('Forbidden', 403, 'Refresh Token Not Found.', true);
  }

  const session = await AuthService.findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send('Session Not Found/Invalid.');
    // throw new AppError('Unauthorized', 401, 'Session not found or is invalid.', true);
  }

  const user = await UserService.findUserById(String(session.user));
  if (!user) return res.status(404).send('User Not Found.');

  const access_token = AuthService.signAccessToken(user, session);

  res.status(200).send({ access_token });
};


const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.refresh_token) {
    return res.status(401).send('Refresh Token Not Found.');
    // throw new AppError('Unauthorized', 401, 'Refresh Token Not Found', true);
  }

  const sessionId = String(res.locals.user.session._id);

  const session = await AuthService.findSessionById(sessionId);
  if (!session || !session.valid) {
    return res.status(401).send('Session Not Found/Invalid.');
    // throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);
  }

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
