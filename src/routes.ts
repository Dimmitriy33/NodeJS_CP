import { Express, Request, Response } from 'express';
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controllers/session.controller';
import { createUserHandler, getUserHandler } from './controllers/user.controller';
import requireUser from './middleware/requireUser';
import validate from './middleware/validateResource';
import { createSessionValidationSchema } from './utils/validation/session.validation';
import { createUserValidationSchema } from './utils/validation/user.validation';

export default function routes(app: Express): void {
  app.get('/testAPI', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/auth/sign-up', validate(createUserValidationSchema), createUserHandler);
  app.post('/api/auth/sign-in', validate(createSessionValidationSchema), createSessionHandler);
  app.get('/api/user', requireUser, getUserHandler);

  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.post('/api/sessions', validate(createSessionValidationSchema), createSessionHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);
}
