import { Express, Request, Response } from 'express';
import { createUserHandler } from './controllers/user.controller';
import validate from './middleware/validateResource';
import { createUserValidationSchema } from './utils/validation/user.validation';

export default function routes(app: Express): void {
    app.get('/testAPI', (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    app.post('/api/users', validate(createUserValidationSchema), createUserHandler);
}
