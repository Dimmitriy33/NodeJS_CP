/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { simpleMapPatch } from '../helpers/jsonPatchMapper';
import UserModel from '../models/user.model';
import { setSessionTokens } from '../services/session.service';
import validatePass, { createUser, findUser, resetPass, updateUser } from '../services/user.service';
import { IResetPassModel } from '../types/userTypes';
import getHashPass from '../utils/hashPass';
import Logger from '../utils/logger';
import { CreateUserInput, UpdateUserInput } from '../utils/validation/user.validation';

const userErrMsgs = {
  createUser: 'Invalid Register Attempt! Please try again.'
  // loginUser: 'Invalid Login Attempt! Email or Password is incorrect'
};

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(user);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Logger.error(err);
    return res.status(404).send(userErrMsgs.createUser);
  }
}

export async function loginUserHandler(req: Request, res: Response) {
  const user = await validatePass(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  let userAgent = req.get('user-agent') || '';

  // just for test to skip error
  if (userAgent === 'PostmanRuntime/7.28.4') {
    userAgent = 'TestUA';
  }

  const tokens = await setSessionTokens(user, userAgent);
  return res.send(tokens.accessToken);
}

export async function getUserHandler(req: Request<{}, {}>, res: Response) {
  const user = await findUser({
    _id: res.locals.user._id
  });

  res.locals.user = user;
  return res.send(user);
}

export async function updateUserHandler(req: Request<{}, {}, UpdateUserInput['body']>, res: Response) {
  const user = req.body;
  await updateUser({ _id: user.id }, omit(user, 'id'));

  return res.send(user);
}

export async function resetPassHandler(req: Request, res: Response) {
  const model: IResetPassModel = simpleMapPatch(req.body);
  const result = await resetPass(model);

  res.status(result.status).send(result.msgOrResModel);
}
