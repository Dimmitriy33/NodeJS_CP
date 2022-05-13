/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'config';
import { Request, Response } from 'express';
import { createSession, findSessions, updateSession } from '../services/session.service';
import validatePass from '../services/user.service';
import { signJWT } from '../utils/jwt';

export async function createSessionHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const user = await validatePass(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  let userAgent = req.get('user-agent') || '';

  // just for test to skip error
  if (userAgent === 'PostmanRuntime/7.28.4') {
    userAgent = 'TestUA';
  }

  const session = await createSession(user._id, userAgent);

  const accessToken = signJWT(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get<string>('accessTokenTtl') // 15min
    }
  );

  const refreshToken = signJWT(
    {
      ...user,
      session: session._id
    },
    {
      expiresIn: config.get<string>('refreshTokenTtl')
    }
  );

  return res.send({
    accessToken,
    refreshToken
  });
}

export async function getUserSessionsHandler(
  _req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  const userId = res.locals.user._id;

  const sessions = await findSessions({
    user: userId,
    valid: true
  });

  return res.send(sessions);
}

export async function deleteSessionHandler(_req: Request, res: Response): Promise<Response<any>> {
  // const userId = res.locals.user._id;
  const sessionId = res.locals.user.session;

  if (!sessionId) {
    return res.sendStatus(404);
  }

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null
  });
}
