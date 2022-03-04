import config from "config";
import jwt from "jsonwebtoken";

// types

  interface IVerifyModel {
    isValid: boolean;
    expired: boolean;
    decoded: string | jwt.JwtPayload | null;
  }

//

const privateKey = config.get<string>("privateJWTKey");
const publicKey = config.get<string>("publicJWTKey");

export function signJWT(
  // eslint-disable-next-line @typescript-eslint/ban-types
  object: Object,
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    //allow us to use public and private keys
    algorithm: "RS256"
  })
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      isValid: true,
      expired: false,
      decoded
    } as IVerifyModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch(error: any) {
    return {
      isValid: false,
      expired: error.message === "jwt expired",
      decoded: null
    } as IVerifyModel;
  }
}