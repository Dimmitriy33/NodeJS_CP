/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';

export default function reqMappper(req: Request, res: Response, next: NextFunction) {
  req.query = new Proxy(req.query, {
    //@ts-ignore
    get: (target, name) => target[Object.keys(target).find((key) => key.toLowerCase() === name.toLowerCase())]
  });

  req.body = new Proxy(req.body, {
    //@ts-ignore
    get: (target, name) => target[Object.keys(target).find((key) => key.toLowerCase() === name.toLowerCase())]
  });

  // if (Array.isArray(req.body)) {
  //   req.body = req.body.map((item) => objKeysToLowerCase(item));
  //   next();
  //   return;
  // }

  // if (typeof req.body === 'object') {
  //   req.body = objKeysToLowerCase(req.body);
  // }

  next();
}
