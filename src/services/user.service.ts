/* eslint-disable @typescript-eslint/no-explicit-any */
import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery, UpdateQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import { IResultModel } from '../types/resultModelTypes';
import { IResetPassModel, UserRoles } from '../types/userTypes';
import getHashPass from '../utils/hashPass';

// Types

export interface IValidatePass {
  email: string;
  password: string;
}

export async function createUser(
  user: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword' | 'role' | 'ratings' | 'ordersList'>
  >
) {
  try {
    const newUser = {
      ...user,
      role: UserRoles.User
    };

    const createdUser = await UserModel.create(newUser);
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

export async function updateUser(query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>) {
  return UserModel.updateOne(query, update);
}

export async function resetPass(model: IResetPassModel): Promise<IResultModel<string>> {
  const user = await UserModel.findOne({
    _id: model.id
  });

  if (!user) {
    return {
      status: 400,
      msgOrResModel: 'User not found'
    };
  }

  const isValid = await user.comparePassword(model.oldPassword);

  if (isValid) {
    const hash = await getHashPass(model.newPassword);
    await updateUser({ _id: user.id }, { password: hash });

    return {
      status: 200,
      msgOrResModel: 'Password changed'
    };
  }

  return {
    status: 400,
    msgOrResModel: 'Old password is not valid'
  };
}
