import SessionModel from "../models/session.model";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({
    user: userAgent,
    userAgent
  });

  return session.toJSON();
}