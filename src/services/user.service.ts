import { UserModel } from '../models';
import { User } from '../models/user.model';

const createUser = (data: Partial<User>) => {
  return UserModel.create(data);
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
