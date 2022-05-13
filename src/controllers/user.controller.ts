/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import Logger from '../utils/logger';
import { CreateUserInput } from '../utils/validation/user.validation';

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

export async function getUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
