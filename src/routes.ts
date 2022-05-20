/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Express, Request, Response } from 'express';
import {
  createProductHandler,
  getProductByIdHandler,
  getTopPopularPlatformsHandler,
  searchProductsByNameHandler,
  softDeleteProductHandler,
  sortAndFilterGamesHandler,
  updateProductHandler,
  editRatingHandler
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
  searchProductsByNameSchema,
  updateProductValidationSchema,
  productSelectionValidationSchema,
  productRatingActionValidationSchema
} from './utils/validation/product.validation';
import { createSessionValidationSchema } from './utils/validation/session.validation';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  resetPassUserValidationSchema
} from './utils/validation/user.validation';
import { addProductsToOrderValidationSchema, getOrderListValidationSchema } from './utils/validation/order.validation';
import upload from './utils/multerConfig';
import { addProductsToOrderHandler, getOrderListHandler } from './controllers/order.controller';

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

  //@ts-ignore
  app.get('/api/games/search', validate(searchProductsByNameSchema), searchProductsByNameHandler);
  app.get('/api/games/top-platforms', getTopPopularPlatformsHandler);
  //@ts-ignore
  app.get('/api/games/list', validate(productSelectionValidationSchema), sortAndFilterGamesHandler);
  app.get('/api/games/:id', validate(getProductValidationSchema), getProductByIdHandler);
  app.post(
    '/api/games',
    productFilesUpload,
    requireUser,
    validate(createProductValidationSchema),
    createProductHandler
  );
  app.post('/api/games/rating', requireUser, validate(productRatingActionValidationSchema), editRatingHandler);
  app.put(
    '/api/games',
    productFilesUpload,
    requireUserWithAdminRole,
    validate(updateProductValidationSchema),
    updateProductHandler
  );
  app.delete('/api/games/soft-remove/id/:id', requireUserWithAdminRole, softDeleteProductHandler);

  //@ts-ignore
  app.get('/api/orders', requireUser, validate(getOrderListValidationSchema), getOrderListHandler);
  app.post('/api/orders', requireUser, validate(addProductsToOrderValidationSchema), addProductsToOrderHandler);
}

// helpers for multer
const productFilesUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]);
