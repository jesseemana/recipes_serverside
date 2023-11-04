import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

const { Schema } = mongoose

const userSchema = new Schema({
  first_name: { type: String, min: 3, max: 24, required: true },
  last_name: { type: String, min: 3, max: 24, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: { type: Array, default: [] },
})

userSchema.pre('save', async function(next) {
  let user = this 

  if (!user.isModified('password')) return next()

  const salt = bcrypt.genSaltSync(config.get('saltWorkFactor'))
  const hash = bcrypt.hashSync(user.password, salt)

  user.password = hash

  return next()
})

userSchema.methods.verifyPassword = async function (candidate_password: string) {
  let user = this

  try {
    return bcrypt.compareSync(user.password, candidate_password)
  } catch(e) {
    console.log('Failed to verify password')
  }
}

const UserModel = mongoose.model('User', userSchema) 

export default UserModel 