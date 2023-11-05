import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

export type UserInput = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface UserDocument extends UserInput, mongoose.Document {
  bookmarks: string[]
  verifyPassword(candidate_password: string): Promise<Boolean>
}

const userSchema = new mongoose.Schema({
  first_name: { type: String, min: 3, max: 24, required: true },
  last_name: { type: String, min: 3, max: 24, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: { type: Array, default: [] },
})

userSchema.pre('save', function(next) {
  let user = this as UserDocument

  if (!user.isModified('password')) return next()

  const salt = bcrypt.genSaltSync(config.get('saltWorkFactor'))
  const hash = bcrypt.hashSync(user.password, salt)

  user.password = hash

  return next()
})

userSchema.methods.verifyPassword = async function (candidate_password: string): Promise<boolean> {
  const user = this as UserDocument
  return bcrypt.compare(user.password, candidate_password).catch((e) => false)
}

const UserModel = mongoose.model<UserDocument>('User', userSchema) 

export default UserModel 
