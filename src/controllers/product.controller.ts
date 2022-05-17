/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { enumToDescriptedArray } from '../helpers/enumToArray';
import { createProduct } from '../services/product.service';
import { GamesGenres, Platforms } from '../types/productTypes';
import { CreateProductInput } from '../utils/validation/product.validation';

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response) {
  const product = await createProduct({
    ...req.body,
    platform:
      Platforms[
        enumToDescriptedArray(Platforms).filter((p) => p.value === req.body.platform)[0].value as keyof typeof Platforms
      ],
    genre:
      GamesGenres[
        enumToDescriptedArray(GamesGenres).filter((g) => g.value === req.body.genre)[0]
          .value as keyof typeof GamesGenres
      ],

    //@ts-ignore
    logo: req.files['logo'][0].fileName,
    //@ts-ignore
    background: req.files['background'][0].fileName,

    isDeleted: false
  } as any);

  return res.send(product);
}
