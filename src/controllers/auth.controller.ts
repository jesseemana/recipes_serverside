import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { findUserByEmail, findUserById } from '../services/user.service';
import { CreateSessionInput } from '../schema/user.schema';
import { 
  createSession, 
  findAllSessions, 
  findSessionById, 
  signAccessToken, 
  signRefreshToken, 
  updateSession 
} from '../services/auth.service';
import { AppError } from '../utils/errors';


export async function findSessionsHandler(_: Request, res: Response) {
  const all_sessions = await findAllSessions();
  res.status(200).send(all_sessions);
}


export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>, 
  res: Response
) => {
  const { email, password } = req.body;
  
  const user = await findUserByEmail(email);
  if (!user || !user.verifyPassword(password)) 
    throw new AppError('Unauthorized', 401, 'User provided invalid login email or password', true);

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
    throw new AppError('Unauthorized', 401, 'No refresh token found', true);
  }

  const refresh_token = cookies.refresh_token as string;

  const decoded = verifyToken<{ session: string }>(refresh_token, 'refreshTokenPublicKey');
  if (!decoded) 
    throw new AppError('Forbidden', 403, 'Could not find refresh token', true);

  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) 
    throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);

  const user = await findUserById(String(session.user));
  if (!user) throw new AppError('Not Found', 404, 'could not find the given user', true);

  const access_token = signAccessToken(user, session);

  res.status(200).send({ access_token });
};


export const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) 
    throw new AppError('Unauthorized', 401, 'No refresh token found', true);

  const sessionId = res.locals.user.session._id as string;

  const session = await findSessionById(sessionId);
  if (!session || !session.valid) 
    throw new AppError('Unauthorized', 401, 'Session is not found or is expired', true);

  await updateSession({ _id: session._id }, { valid: false });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });

  res.send('User loged out successfully.');
}
