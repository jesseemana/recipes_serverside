import SessionModel, { Session } from '../models/session.model'
import { FilterQuery, UpdateQuery } from 'mongoose'
import { User } from '../models/user.model'
import { omit } from 'lodash'
import { DocumentType } from '@typegoose/typegoose'
import { signJwt } from '../utils/jwt'


export const findAllSessions = async () => {
  return SessionModel.find()
}

export const deleteAllSessions = async () => {
  return SessionModel.deleteMany()
}

export const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId })
}

export const findSessionById = async (id: string) => {
  return SessionModel.findById(id)
}

export const updateSession = (query: FilterQuery<Session>, update: UpdateQuery<Session>) => {
  return SessionModel.findOneAndUpdate(query, update)
}

export const signAccessToken = (user: DocumentType<User>, session: DocumentType<Session>) => {
  const user_details = omit(user.toJSON(), ['password', 'bookmarks'])

  const access_token = signJwt({ ...user_details, session }, 'accessTokenPrivateKey', { expiresIn: '1m' })

  return access_token 
}

export const signRefreshToken = (session: DocumentType<Session>) => {
  const refresh_token = signJwt({ session: session._id }, 'refreshTokenPrivateKey', { expiresIn: '30d' })

  return refresh_token
}
