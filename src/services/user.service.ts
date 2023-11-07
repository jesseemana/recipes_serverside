import UserModel, { User } from "../models/user.model";

export const createUser = (data: Partial<User>) => {
  return UserModel.create(data);
};

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};
