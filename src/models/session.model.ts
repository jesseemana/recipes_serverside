import mongoose from 'mongoose'

const { Schema } = mongoose

const SessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  valid: { type: Boolean, default: true }
},{
  timestamps: true
})

const SessionModel = mongoose.model('Session', SessionSchema)

export default SessionModel
