import { omit } from 'lodash'
import { Jwt } from '../utils'
import { SessionModel } from '../models';
import { Session } from '../models/session.model';
import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { User, private_fields } from '../models/user.model';


const findAllSessions = async () => {
  return await SessionModel.find({});
}

const createSession = async ({ userId }: { userId: string }) => {
  return await SessionModel.create({ user: userId });
}

const findSessionById = async (id: string) => {
  return await SessionModel.findById(id);
}

const destroySession = async (query: FilterQuery<Session>, update: UpdateQuery<Session>) => {
  return await SessionModel.findOneAndUpdate(query, update);
}

const signAccessToken = (user: DocumentType<User>, session: DocumentType<Session>) => {
  const user_payload = omit(user.toJSON(), private_fields);
  
  const private_key = String(process.env.ACCESS_TOKEN_PRIVATE_KEY);
  const time_to_live = String(process.env.ACCESS_TOKEN_TIME_TO_LIVE);

  const access_token = Jwt.signJwt({ ...user_payload, session }, private_key, { expiresIn: time_to_live });

  return access_token ;
}

const signRefreshToken = (session: DocumentType<Session>) => {
  const private_key = String(process.env.REFRESH_TOKEN_PRIVATE_KEY);
  const time_to_live = String(process.env.REFRESH_TOKEN_TIME_TO_LIVE);
  
  const refresh_token = Jwt.signJwt({ session: session._id }, private_key, { expiresIn: time_to_live });

  return refresh_token;
}

export default {
  createSession,
  destroySession,
  findAllSessions,
  findSessionById,
  signAccessToken,
  signRefreshToken,
}
