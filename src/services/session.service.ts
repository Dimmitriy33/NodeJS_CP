import config from 'config';
import { get } from 'lodash';
import { FilterQuery, UpdateQuery } from 'mongoose';
import SessionModel, { SessionDocument } from '../models/session.model';
import { signJWT, verifyJWT } from '../utils/jwt';
import { findUser } from './user.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSession(userId: string, userAgent: string): Promise<any> {
  const session = await SessionModel.create({
    user: userId,
    userAgent
  });

  return session.toJSON();
}

// tslint:disable-next-line: typedef
export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel
    .find(query)
    .lean();
}

// tslint:disable-next-line: typedef
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({refreshToken}: {
  refreshToken: string
}): Promise<boolean | string> {
  const decoded = verifyJWT(refreshToken);

  const id = get(decoded, 'session');
  if (!decoded || !id) {
    return false;
  }

  // tslint:disable-next-line: await-promise
  const session = await SessionModel.findById(id);

  if (!session || !session.isValid) {
    return false;
  }

  const user = await findUser({_id: session.user});

  if (!user) {
    return false;
  }

  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get<string>('accessTokenTtl') } // 15min
  );

  return accessToken;
}
