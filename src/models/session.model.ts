import { User } from './user.model'
// import mongoose from 'mongoose'
import { getModelForClass, prop, Ref } from '@typegoose/typegoose'

class Session {
  @prop({ ref: () => User })
  user: Ref<User>
  
  @prop({ default: true })
  valid: boolean
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true
  }
})

export default SessionModel 

// export interface SessionDocument extends mongoose.Document {
//   user: User['_id']
//   valid: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// const SessionSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   valid: { type: Boolean, default: true }
// },{
//   timestamps: true
// })

// const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema)

// export default SessionModel
