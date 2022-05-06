import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';

// Types

export interface IValidatePass {
  email: string;
  password: string;
}

export async function createUser(
  user: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>
) {
  try {
    const createdUser = await UserModel.create(user);
    return omit(createdUser.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
  }
}

export default async function validatePass({ email, password }: IValidatePass) {
  const user = await UserModel.findOne({
    email
  });

  if (!user) {
    return null;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return null;
  }

  return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
