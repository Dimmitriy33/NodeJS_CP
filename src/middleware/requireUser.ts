import { NextFunction, Request, Response } from 'express';

// tslint:disable-next-line: typedef
export default function requireUser(req: Request, res: Response, next: NextFunction) {
  const user =  res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
}
