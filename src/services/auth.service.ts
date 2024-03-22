import { omit } from 'lodash'
import { Jwt } from '../utils'
import { SessionModel } from '../models';
import { Session } from '../models/session.model';
import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { User, private_fields } from '../models/user.model';


const findAllSessions = async () => {
  const sessions = await SessionModel.find({});
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

const destroySession = async (query: FilterQuery<Session>, update: UpdateQuery<Session>) => {
  await SessionModel.findOneAndUpdate(query, update);
  return true;
}

const signAccessToken = async (user: DocumentType<User>, session: DocumentType<Session>) => {
  const user_payload = omit(user.toJSON(), private_fields);
  const private_key = String(process.env.ACCESS_TOKEN_PRIVATE_KEY);
  const time_to_live = String(process.env.ACCESS_TOKEN_TIME_TO_LIVE);

  const access_token = Jwt.signJwt({ ...user_payload, session }, private_key, { expiresIn: time_to_live });

  return access_token;
}

const signRefreshToken = async (session: DocumentType<Session>) => {
  const private_key = String(process.env.REFRESH_TOKEN_PRIVATE_KEY);
  const time_to_live = String(process.env.REFRESH_TOKEN_TIME_TO_LIVE);
  
  const refresh_token = Jwt.signJwt({ session: session._id }, private_key, { expiresIn: time_to_live });

  return refresh_token;
}

export default {
  findAllSessions,
  destroySession,
  findSessionById,
  createSession,
  signAccessToken,
  signRefreshToken,
}
