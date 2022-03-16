import { Express, Request, Response } from 'express';
import { createSessionHandler, getUserSessionsHandler } from './controllers/session.controller';
import { createUserHandler } from './controllers/user.controller';
import requireUser from './middleware/requireUser';
import validate from './middleware/validateResource';
import { createSessionValidationSchema } from './utils/validation/session.validation';
import { createUserValidationSchema } from './utils/validation/user.validation';

export default function routes(app: Express): void {
    app.get('/testAPI', (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    app.post('/api/users', validate(createUserValidationSchema), createUserHandler);
    app.get('/api/sessions', requireUser, getUserSessionsHandler);
    app.post('/api/sessions', validate(createSessionValidationSchema), createSessionHandler);
}
