import bcrypt from 'bcrypt'; // argon2 is also a good alternative to bcrypt 🤷🏾‍♂️
import { log }from '../utils';
import { 
  pre, 
  prop, 
  index, 
  Severity, 
  modelOptions, 
  DocumentType, 
  getModelForClass, 
} from '@typegoose/typegoose';

@pre<User>('save', function() {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    return;
  }
  return;
})

@index({ email: 1})

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})

export class User {
  @prop({ required: true })
  first_name: string;

  @prop({ required: true })
  last_name: string;

  @prop({ required: true, lowercase: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: [] })
  bookmarks: Array<string>;

  verifyPassword(this: DocumentType<User>, candidate_password: string) {
    try {
      return bcrypt.compareSync(candidate_password, this.password);
    } catch(err) {
      log.error('Password validation failed!');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
