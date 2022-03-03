import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";

export async function createUser(user: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) {
  try {
    return await UserModel.create(user);
  } catch(e: any) {
     throw new Error(e);
  }
}