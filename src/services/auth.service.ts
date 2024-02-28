import { omit } from 'lodash'
import { Jwt } from '../utils'
import { SessionModel } from '../models'
import { Session } from '../models/session.model'
import { DocumentType } from '@typegoose/typegoose'
import { FilterQuery, UpdateQuery } from 'mongoose'
import { User, private_fields } from '../models/user.model'


const findAllSessions = async () => {
  return SessionModel.find({})
}

const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId })
}

const findSessionById = async (id: string) => {
  return SessionModel.findById(id)
}

const destroySession = (query: FilterQuery<Session>, update: UpdateQuery<Session>) => {
  return SessionModel.findOneAndUpdate(query, update)
}

const signAccessToken = (user: DocumentType<User>, session: DocumentType<Session>) => {
  const user_payload = omit(user.toJSON(), private_fields)
  
  const access_token = Jwt.signJwt(
    { ...user_payload, session }, 
    String(process.env.ACCESS_TOKEN_PRIVATE_KEY), 
    { expiresIn: String(process.env.ACCESS_TOKEN_TIME_TO_LIVE) }
  )

  return access_token 
}

const signRefreshToken = (session: DocumentType<Session>) => {
  const refresh_token = Jwt.signJwt(
    { session: session._id }, 
    String(process.env.REFRESH_TOKEN_PRIVATE_KEY), 
    { expiresIn: String(process.env.REFRESH_TOKEN_TIME_TO_LIVE) }
  )

  return refresh_token
}

export default {
  createSession,
  destroySession,
  findAllSessions,
  findSessionById,
  signAccessToken,
  signRefreshToken,
}
