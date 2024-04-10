import { omit } from 'lodash';
import { Jwt } from '../utils';
import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { User } from '../models/user.model';
import { SessionModel } from '../models';
import { Session } from '../models/session.model';


const findAllSessions = async () => {
  const sessions = await SessionModel.find({})
    .sort({ createdAt: -1 })
    .limit(10);

  return sessions;
}

const createSession = async (data: Session) => {
  const session = new SessionModel(data);
  await session.save();
  return session;
}

const findSessionById = async (id: string) => {
  const session = await SessionModel.findById(id);
  return session;
}

async function destroySession(
  query: FilterQuery<Session>, 
  update: UpdateQuery<Session>
) {
  const updated = await SessionModel.findOneAndUpdate(query, update);
  if (updated) return true;

  return false;
}

const signAccessToken = (user: DocumentType<User>) => {
  const user_payload = omit(user.toJSON(), 'password');
  const time_to_live = String(process.env.ACCESS_TOKEN_TIME_TO_LIVE);

  const access_token = Jwt.signJwt(
    user_payload, // decode token(online) and check payload
    String(process.env.ACCESS_TOKEN_PRIVATE_KEY), 
    { expiresIn: time_to_live }
  );

  return access_token;
}

const signRefreshToken = async (session: DocumentType<Session>) => {
  const time_to_live = String(process.env.REFRESH_TOKEN_TIME_TO_LIVE);
  
  const refresh_token = Jwt.signJwt(
    { session: session._id }, 
    String(process.env.REFRESH_TOKEN_PRIVATE_KEY), 
    { expiresIn: time_to_live }
  );

  return refresh_token;
}

export default {
  findAllSessions,
  destroySession,
  findSessionById,
  signAccessToken,
  createSession,
  signRefreshToken,
}
