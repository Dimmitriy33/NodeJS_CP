import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../types/userTypes';

export default function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
}

export function requireUserWithAdminRole(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  // if (!user || user.role !== UserRoles.Admin) {
  //   return res.sendStatus(403);
  // }

  if (!user) {
    return res.status(403).send({ msg: 'You are not authorized to perform this action' });
  }

  if (user.role !== UserRoles.Admin) {
    return res.status(403).send({ msg: "You dont't have permission to perform this action" });
  }

  return next();
}
