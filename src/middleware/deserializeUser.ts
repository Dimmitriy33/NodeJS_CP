import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../services/session.service';
import { verifyJWT } from '../utils/jwt';

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded != null) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken as string);
    }

    const result = verifyJWT(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
}
