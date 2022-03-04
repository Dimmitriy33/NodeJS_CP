import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import Logger from '../utils/logger';
import { CreateUserInput } from '../utils/validation/user.validation';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function createUserHandler(req: Request<{}, {} , CreateUserInput["body"]>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(user);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Logger.error(err);
    return res.status(409).send(err.message); // 409 - indicates a request conflict with the current state of the target resource
  }
}