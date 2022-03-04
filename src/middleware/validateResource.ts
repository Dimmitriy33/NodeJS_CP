import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export default function validate(schema: AnyZodObject)
    : (req: Request, res: Response, next: NextFunction)
    => Response | undefined {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        } catch (err) {
            return res
            .status(400)
            .send({
                error: err
            });
        }
    };
}
