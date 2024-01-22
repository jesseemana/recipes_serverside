import { omit } from 'lodash';
import { UserModel } from '../models';
import { User } from '../models/user.model';

const createUser = async (data: Partial<User>) => {
  const user = await UserModel.create(data);
  return omit(user.toJSON(), 'password', 'confirm_password', 'verifyPassword')
};

const findUserById = (id: string) => {
  return UserModel.findById(id);
};

const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export default {
  createUser,
  findUserById,
  findUserByEmail,
}
