import SessionModel from '../models/session.model'
import { User } from '../models/user.model'
import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { signJwt } from '../utils/jwt'
import log from '../utils/logger'

export const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId })
}

export const findSessionById = async (id: string) => {
  return SessionModel.findById(id)
}

export const signAccessToken = async (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), ['password', 'bookmarks'])
  const access_token = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: '1d' })

  return access_token
}

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({userId})

  const refresh_token = signJwt({ session: session._id }, 'refreshTokenPrivateKey', { expiresIn: '14d' })

  return refresh_token
}
