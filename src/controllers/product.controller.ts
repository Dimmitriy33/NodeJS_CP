/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { enumToDescriptedArray } from '../helpers/enumToArray';
import { CloudinaryApi } from '../services/cloudinary.service';
import { createProduct, findProduct, findProducts, searchProductsByName } from '../services/product.service';
import { GamesGenres, Platforms } from '../types/productTypes';
import { CreateProductInput, SearchProductsInput } from '../utils/validation/product.validation';
import fs from 'fs';

const prodErrMsgs = {
  productNotFound: 'Product not found'
  // loginUser: 'Invalid Login Attempt! Email or Password is incorrect'
};

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

export async function getProductByIdHandler(req: Request<{ id: string }, {}, {}>, res: Response) {
  const product = await findProduct({
    _id: req.params.id
  });

  if (!product) {
    return res.status(404).send({ message: prodErrMsgs.productNotFound });
  }

  return res.send(product);
}

export async function searchProductsByNameHandler(
  req: Request<{}, {}, {}, SearchProductsInput['query']>,
  res: Response
) {
  const { term, limit, offset } = req.query;
  console.log(req.query, 'req');
  const products = await searchProductsByName(term as string, limit, offset);

  return res.send(products);
}

export async function getTopPopularPlatformsHandler(req: Request<{}, {}, {}>, res: Response) {
  // const topPlatforms = await getTopPopularPlatforms(3);
  // return res.send(topPlatforms);

  const products = await findProducts({
    isDeleted: false
  });

  const topPlatforms = products.reduce((acc, curr) => {
    if (acc[curr.platform]) {
      acc[curr.platform]++;
    } else {
      acc[curr.platform] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const topPlatformsArray = Object.keys(topPlatforms).map((key) => {
    return {
      platform: enumToDescriptedArray(Platforms).filter((v) => v.key === Number(key))[0].value,
      count: topPlatforms[key]
    };
  });

  topPlatformsArray.sort((a, b) => {
    return b.count - a.count;
  });

  const result = [];
  for (let i = 0; i < 3; i++) {
    if (topPlatformsArray[i]) {
      result.push(topPlatformsArray[i].platform);
    }
  }

  return res.send(result);
}
