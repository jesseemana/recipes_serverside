import { User } from './user.model';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

export class Session {
  @prop({ ref: () => User })
  user: Ref<User>;
  
  @prop({ default: true })
  valid: boolean;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  }
});

export default SessionModel;
