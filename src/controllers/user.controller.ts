import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import Logger from '../utils/logger';
import { CreateUserInput } from '../utils/validation/user.validation';

export async function createUserHandler(req: Request<null, null , CreateUserInput["body"]>, res: Response) {
  try {
    const user = await createUser(req.body);
  } catch (err: any) {
    Logger.error(err);
    return res.status(409).send(err.message); // 409 - indicates a request conflict with the current state of the target resource
  }
}