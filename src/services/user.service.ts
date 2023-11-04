import User, { UserInput } from '../models/user.model'

export const createUser = (data: UserInput) => {
  return User.create(data);
};

export const findUserById = (id: string) => {
  return User.findById(id);
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};
