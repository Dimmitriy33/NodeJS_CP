/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { enumToDescriptedArray } from '../helpers/enumToArray';
import { CloudinaryApi } from '../services/cloudinary.service';
import { createProduct } from '../services/product.service';
import { GamesGenres, Platforms } from '../types/productTypes';
import { CreateProductInput } from '../utils/validation/product.validation';
import fs from 'fs';

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response) {
  const platformItem = enumToDescriptedArray(Platforms).filter(
    (v) => v.value.toLowerCase() === req.body.platform.toLowerCase()
  )[0];

  const genreItem = enumToDescriptedArray(GamesGenres).filter(
    (v) => v.value.toLowerCase() === req.body.genre.toLowerCase()
  )[0];

  //@ts-ignore
  const logoPath = req.files['logo'][0].path;
  //@ts-ignore
  const backPath = req.files['background'][0].path;

  const logo = await CloudinaryApi.upload(logoPath);
  const background = await CloudinaryApi.upload(backPath);
  fs.unlinkSync(logoPath);
  fs.unlinkSync(backPath);

  const prod = {
    ...req.body,
    platform: platformItem.key,
    genre: genreItem.key,
    logo: logo.url,
    background: background.url,
    isDeleted: false
  };

  const product = await createProduct(prod);
  return res.send(product);
}
