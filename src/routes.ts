import { Express, Request, Response } from 'express';
import {
  createProductHandler,
  getProductByIdHandler,
  getTopPopularPlatformsHandler,
  searchProductsByNameHandler,
  softDeleteProductHandler
} from './controllers/product.controller';
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controllers/session.controller';
import {
  createUserHandler,
  getUserHandler,
  loginUserHandler,
  resetPassHandler,
  updateUserHandler
} from './controllers/user.controller';
import requireUser, { requireUserWithAdminRole } from './middleware/requireUser';
import validate from './middleware/validateResource';
import {
  createProductValidationSchema,
  getProductValidationSchema,
  searchProductsByNameSchema
} from './utils/validation/product.validation';
import { createSessionValidationSchema } from './utils/validation/session.validation';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  resetPassUserValidationSchema
} from './utils/validation/user.validation';
import upload from './utils/multerConfig';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  app.get('/api/games/search', requireUser, validate(searchProductsByNameSchema), searchProductsByNameHandler);
  app.get('/api/games/top-platforms', requireUser, getTopPopularPlatformsHandler);
  app.get('/api/games/:id', requireUser, validate(getProductValidationSchema), getProductByIdHandler);
  app.post('/api/games', cpUpload, requireUser, validate(createProductValidationSchema), createProductHandler);
  app.delete('/api/games/soft-remove/id/:id', requireUserWithAdminRole, softDeleteProductHandler);
}

// helpers for multer
const cpUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]);
