import { FilterQuery, UpdateQuery } from 'mongoose';
import SessionModel, { SessionDocument } from '../models/session.model';

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

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}
