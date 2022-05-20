/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import renameKeys from '../helpers/renameObjKeys';

export default function resMappper(req: Request, res: Response, next: NextFunction) {
  const send = res.send;
  //@ts-ignore
  res.send = function (body) {
    if (Array.isArray(body)) {
      body = body.map((item) =>
        renameKeys(item, {
          _id: 'id'
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body.forEach((item: any) => {
        delete item.__v;
        delete item.createdAt;
        delete item.updatedAt;
      });

      send.call(this, body);
      return;
    }

    if (typeof body === 'object') {
      body = renameKeys(body, {
        _id: 'id'
      });
      delete body.__v;
      delete body.createdAt;
      delete body.updatedAt;
    }

    send.call(this, body);
    return;
  };

  next();
}
