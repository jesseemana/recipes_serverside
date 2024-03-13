import { omit } from 'lodash';
import { UserModel } from '../models';
import { User } from '../models/user.model';

const createUser = async (data: Partial<User>) => {
  const user = await UserModel.create(data);
  return omit(user.toJSON(), 'password');
};

const findUserById = async (id: string) => {
  return await UserModel.findById(id).select('-password');
};

const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email }).select('-password');
};

export default {
  createUser,
  findUserById,
  findUserByEmail,
};
