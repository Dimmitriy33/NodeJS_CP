/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { isSymbol } from 'lodash';
import { objKeysToFirstLetterLowerCase } from '../helpers/renameObjKeys';

export default function reqMappper(req: Request, res: Response, next: NextFunction) {
  req.query = new Proxy(req.query, {
    //@ts-ignore
    get: (target, name) =>
      target[
        //@ts-ignore
        Object.keys(target).find((key) => {
          const v1 = key.charAt(0).toLowerCase() + key.slice(1);
          const v2 = isSymbol(name) ? name : name.charAt(0).toLowerCase() + name.slice(1);
          return v1 === v2;
        })
      ]
  });

  // req.body = new Proxy(req.body, {
  //   //@ts-ignore
  //   get: (target, name) => target[Object.keys(target).find((key) => key.toLowerCase() === name.toLowerCase())]
  // });

  if (Array.isArray(req.body)) {
    req.body = req.body.map((item) => objKeysToFirstLetterLowerCase(item));
    next();
    return;
  }

  if (typeof req.body === 'object') {
    req.body = objKeysToFirstLetterLowerCase(req.body);
  }

  next();
}
