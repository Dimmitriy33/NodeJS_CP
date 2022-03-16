import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJWT } from '../utils/jwt';

// tslint:disable-next-line: typedef
export default function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = get(
      req,
      'headers.authorization',
      ''
    )
    .replace(/^Bearer\s/, '');

  if (!accessToken) {
    return next();
  }

  const {decoded, expired} = verifyJWT(accessToken);

  if (decoded != null) {
    res.locals.user = decoded;
    return next();
  }

  return next();
}
