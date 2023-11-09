import bcrypt from 'bcrypt'
import config from 'config'
import log from '../utils/logger'
import { prop, getModelForClass, DocumentType, pre, modelOptions, Severity, index } from '@typegoose/typegoose'

@pre<User>('save', function() {
  if (!this.isModified('password')) return

  const salt = bcrypt.genSaltSync(config.get<number>('saltWorkFactor'))
  const hash = bcrypt.hashSync(this.password, salt)

  this.password = hash

  return
})

@index({ email: 1})

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})

export class User {
  @prop({ required: true })
  first_name: string

  @prop({ required: true })
  last_name: string

  @prop({ lowercase: true, required:true, unique: true })
  email: string

  @prop({ required: true })
  password: string

  @prop({ default: [] })
  bookmarks: Array<string>

  verifyPassword(this: DocumentType<User>, candidate_password: string) {
    try {
      return bcrypt.compareSync(candidate_password, this.password)
    } catch(err) {
      log.error('Failed to validate password')
      return false
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel
