/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { findSessions, updateSession } from '../services/session.service';
import validatePass from '../services/user.service';
import { setSessionTokens } from '../services/session.service';

export async function createSessionHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
  const user = await validatePass(req.body);

  if (!user) {
    return res.status(404).send('Invalid user credits!');
  }

  let userAgent = req.get('user-agent') || '';

  // just for test to skip error
  if (userAgent === 'PostmanRuntime/7.28.4') {
    userAgent = 'TestUA';
  }

  const tokens = await setSessionTokens(user, userAgent);
  return res.send(tokens);
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
  console.log(sessionId);

  if (!sessionId) {
    return res.sendStatus(404);
  }

  await updateSession({ _id: sessionId }, { isValid: false });

  return res.send({
    accessToken: null,
    refreshToken: null
  });
}
