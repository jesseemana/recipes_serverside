import { omit } from 'lodash';
import { UserModel } from '../models';
import { User } from '../models/user.model';

const createUser = async (data: Partial<User>) => {
  const user = await UserModel.create(data);
  return omit(user.toJSON(), 'password');
}

const findUserById = async (id: string) => {
  const user = await UserModel.findById(id).select('-password').exec();
  return user;
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).select('-password').exec();
  return user;
}

export default {
  createUser,
  findUserById,
  findUserByEmail,
}
