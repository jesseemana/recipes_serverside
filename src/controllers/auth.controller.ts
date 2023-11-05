import{ Request, Response } from 'express';
import { verifyToken,signJwt } from '../utils/jwt';
import { findUserByEmail,createUser, findUserById } from '../services/user.service';
import { findSessionById, signAccessToken, signRefreshToken } from '../services/auth.service';
import { CreateSessionInput, CreateUserInput } from '../schema/schema';


const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
  const body = req.body

  const exists = await findUserByEmail(body.email);
  if (exists) return res.status(409).send('Email already in use');

  const new_user = await createUser(body)

  if (new_user) {
    // send account verification email here
    return res.status(201).send(`New user ${body.first_name} ${body.last_name} has been created.`);
  } else {
    res.status(400).send('Invalid user data received.');
  }
};


const createSessionHandler = async (req: Request<{}, {}, CreateSessionInput>, res: Response) => {
  const { email, password } = req.body

  const message = 'Invalid user credentials given'

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).send(message);

  const valid_password = user.verifyPassword(password)
  if (!valid_password) return res.status(400).send(message);

  const access_token = signAccessToken(user)

  const refresh_token = await signRefreshToken({userId: user._id})

  res.cookie('jwt', refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'none', // cross-site access
    maxAge: 14 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ user, access_token });
};


const refreshTokenHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized.' });

  const refresh_token = cookies.jwt as string;
  console.log(refresh_token)

  const decoded = verifyToken<{ session: string }>(refresh_token, 'refreshTokenPublicKey');
  if (!decoded) return res.status(401).send(`Couldn't find refresh token`)

  const session = await findSessionById(decoded.session)
  if (!session || !session.valid) return res.status(401).send('Could not send refresh token')

  const user = await findUserById(String(session.user))
  if (!user) return res.status(401).send('Could not find user');

  const access_token = signAccessToken(user);

  return res.send({ access_token });
};


const destroySessionHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No cookie, we're good either way

  res.clearCookie('jwt', {
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
