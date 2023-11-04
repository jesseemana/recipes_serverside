import { Document } from 'mongoose'
import Session from '../models/session.model'
import User from '../models/user.model'

export const createSession = async ({ userId }: { userId: string }) => {
  return Session.create({ userId })
}

// const signAccessToken = async (user: Document<User>) => {

// }

export const signRefreshToken = async () => {

}
