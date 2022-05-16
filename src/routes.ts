import { Express, Request, Response } from 'express';
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controllers/session.controller';
import {
  createUserHandler,
  getUserHandler,
  loginUserHandler,
  resetPassHandler,
  updateUserHandler
} from './controllers/user.controller';
import requireUser from './middleware/requireUser';
import validate from './middleware/validateResource';
import { createSessionValidationSchema } from './utils/validation/session.validation';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  resetPassUserValidationSchema
} from './utils/validation/user.validation';

export default function routes(app: Express): void {
  app.get('/testAPI', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/auth/sign-up', validate(createUserValidationSchema), createUserHandler);
  app.post('/api/auth/sign-in', validate(createSessionValidationSchema), loginUserHandler);
  app.get('/api/user', requireUser, getUserHandler);
  app.put('/api/user', requireUser, validate(updateUserValidationSchema), updateUserHandler);
  app.patch('/api/user/password', requireUser, validate(resetPassUserValidationSchema), resetPassHandler);

  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.post('/api/sessions', validate(createSessionValidationSchema), createSessionHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);
}
