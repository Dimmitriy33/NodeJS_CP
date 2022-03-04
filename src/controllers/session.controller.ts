
import config from 'config';
import { Request, Response } from 'express';
import { createSession } from '../services/session.service';
import { validatePass } from '../services/user.service';
import { signJWT } from '../utils/jwt';

export async function createSessionHandler(req: Request, res: Response) {

  const user = await validatePass(req.body);

  if(!user) {
    return res.status(401).send("Invalid email or password");
  }

  const session = await createSession(user._id, req.get("user-agent") || "");
  const accessToken = signJWT({
      ...user,
      session: session._id
    }, {
      expiresIn: config.get<string>("accessTokenTtl") // 15min
    }
  );

  const refreshToken =  signJWT({
      ...user,
      session: session._id
    }, {
      expiresIn: config.get<string>("accessTokenTtl") // 15min
    }
  );

  return res.send({
    accessToken,
    refreshToken
  });
}