import{ Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'
import { findUserByEmail,createUser, findUserById } from '../services/user.service'
import { findSessionById, signAccessToken, signRefreshToken, updateSession } from '../services/auth.service'
import { CreateSessionInput, CreateUserInput } from '../schema/user.schema'


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


const createSessionHandler = async (req: Request<{}, {}, CreateSessionInput>, res: Response) => {
  const message = 'Invalid user credentials given'
  const { email, password } = req.body
  
  const user = await findUserByEmail(email)
  
  if (!user) return res.send(message)

  if (!user.verifyPassword(password)) {
    return res.send(message)
  }

  const access_token = signAccessToken(user)

  const refresh_token = await signRefreshToken({ userId: String(user._id) })

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'none', // cross-site access
    maxAge: 14 * 24 * 60 * 60 * 1000
  })

  res.status(200).send({ user, access_token })
}


const refreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).send('Unauthorized')

  const refresh_token = cookies.jwt as string;

  const decoded = verifyToken<{ session: string }>(refresh_token, 'refreshTokenPublicKey');
  
  if (!decoded) return res.status(401).send(`Couldn't find refresh token`);

  const session = await findSessionById(decoded.session)

  if (!session || !session.valid) {
    return res.status(401).send('Could not send refresh token')
  }

  const user = await findUserById(String(session.user))
  if (!user) return res.status(401).send('Could not find user');

  const access_token = signAccessToken(user);

  return res.send(access_token);
};


const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No cookie, we're good either way

  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.send('Cookie cleared.');
};


export {
  createUserHandler,
  createSessionHandler,
  refreshTokenHandler,
  destroySessionHandler
};
