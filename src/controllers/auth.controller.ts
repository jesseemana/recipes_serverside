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
  
  const user = await UserService.findUserByEmail(email);
  if (!user) return res.status(404).send('User does not exist.');
  if (!user.verifyPassword(password)) {
    return res.status(401).send('Please provide a correct password.');
  }

  const session = await AuthService.createSession({ userId: String(user._id) });
  const access_token = AuthService.signAccessToken(user, session);
  const refresh_token = AuthService.signRefreshToken(session);

  res.cookie('refresh_token', refresh_token, {
    maxAge: 30*24*60*60*1000, // 30 days
    httpOnly: true,
    secure: false,
    sameSite: 'strict', // cross-site access
    path: '/',
  });

  res.status(200).send({ user, access_token });
};


const refreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) {
    return res.status(401).send('No refresh token found.');
    // throw new AppError('Unauthorized', 401, 'No refresh token found', true);
  }

  const refresh_token = cookies.refresh_token as string;

  const decoded = Jwt.verifyToken<{ session: string }>(refresh_token, String(process.env.REFRESH_TOKEN_PUBLIC_KEY));
  if (!decoded) {
    return res.status(403).send('No refresh token found.');
    // throw new AppError('Forbidden', 403, 'Could not find refresh token', true);
  }

  const session = await AuthService.findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(401).send('Session is not found or is expired.');
    // throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);
  }

  const user = await UserService.findUserById(String(session.user));
  if (!user) return res.status(404).send('Could not find the user.')

  const access_token = AuthService.signAccessToken(user, session);

  res.status(200).send({ access_token });
};


const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) {
    return res.status(401).send('No refresh token found.');
    // throw new AppError('Unauthorized', 401, 'No refresh token found', true);
  }

  const sessionId = res.locals.user.session._id as string;

  const session = await AuthService.findSessionById(sessionId);
  if (!session || !session.valid) {
    return res.status(401).send('Session is not found or is expired.');
    // throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);
  }

  await AuthService.updateSession({ _id: session._id }, { valid: false });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  res.status(200).send('User loged out successfully.');
}

export default {
  findSessionsHandler,
  createSessionHandler,
  refreshTokenHandler,
  destroySessionHandler,
}
