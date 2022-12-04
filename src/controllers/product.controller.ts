/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { enumToDescriptedArray } from '../helpers/enumToArray';
import { CloudinaryApi } from '../services/cloudinary.service';
import {
  changeProductRating,
  createProduct,
  deleteProduct,
  findProduct,
  findProducts,
  searchProductsByName,
  softDeleteProduct,
  sortAndFilterGames,
  updateProduct
} from '../services/product.service';
import { Platforms } from '../types/productTypes';
import {
  CreateProductInput,
  ProductRatingActionInput,
  ProductSelectionInput,
  SearchProductsInput,
  UpdateProductInput
} from '../utils/validation/product.validation';
import fs from 'fs';
import { getGenreNameByValue, getPlatformNameByValue } from '../helpers/productHelpers';
import { createProductRating } from '../services/productRating.service';

const prodErrMsgs = {
  productNotFound: 'Product not found'
  // loginUser: 'Invalid Login Attempt! Email or Password is incorrect'
};

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response) {
  const prod = await getProductDataHelper(req);
  const product = await createProduct({
    ...prod,
    isDeleted: false
  });
  return res.status(201).send(product);
}

export async function getProductByIdHandler(req: Request<{ id: string }, {}, {}>, res: Response) {
  const id = req.params.id;

  const product = await findProduct({
    _id: id,
    isDeleted: false
  });

  if (!product) {
    return res.status(404).send({ message: prodErrMsgs.productNotFound });
  }

  return res.send(product);
}

export async function searchProductsByNameHandler(req: Request<{}, {}, {}, unknown>, res: Response) {
  const { term, limit, offset } = req.query as SearchProductsInput['query'];
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

export async function softDeleteProductHandler(req: Request<{ id: string }, {}, {}>, res: Response) {
  const id = req.params.id;

  await checkIsProductExist(id, res, false);

  await softDeleteProduct(id);
  return res.sendStatus(200);
}

export async function hardDeleteProductHandler(req: Request<{ id: string }, {}, {}>, res: Response) {
  const id = req.params.id;

  await checkIsProductExist(id, res, false);

  await deleteProduct(id);
  return res.sendStatus(200);
}

export async function updateProductHandler(req: Request<{}, {}, UpdateProductInput['body']>, res: Response) {
  const id = req.body.id;
  await checkIsProductExist(id, res);
  const prod = await getProductDataHelper(req);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateProduct({ _id: id }, prod as any);
  } catch (err) {
    return res.status(404).send(err);
  }

  return res.send(prod);
}

export async function sortAndFilterGamesHandler(req: Request<{}, {}, {}, unknown>, res: Response) {
  const { limit, offset, filterType, filterValue, sortField, orderType } = req.query as ProductSelectionInput['query'];
  const result = await sortAndFilterGames(limit, offset, filterType, filterValue, sortField, orderType);
  return res.send(result);
}

export async function editRatingHandler(req: Request<{}, {}, ProductRatingActionInput['body']>, res: Response) {
  const userId = res.locals.user._id;
  const { productId, rating } = req.body;

  await checkIsProductExist(productId, res);
  const productRating = await createProductRating({
    rating,
    userId,
    productId
  });

  await changeProductRating(productId);
  return res.send(productRating);
}

// helper functions --
export async function checkIsProductExist(id: string, res: Response, isDeleted: boolean | undefined = undefined) {
  let query: {
    _id: string;
    isDeleted?: boolean;
  } = {
    _id: id
  };

  if (isDeleted !== undefined) {
    query = {
      ...query,
      isDeleted
    };
  }

  const product = await findProduct(query);

  if (!product) {
    return res.status(404).send({ message: prodErrMsgs.productNotFound });
  }

  return true;
}

async function getProductDataHelper(req: Request<{}, {}, CreateProductInput['body'] | UpdateProductInput['body']>) {
  const platformItem = getPlatformNameByValue(req.body.platform);
  const genreItem = getGenreNameByValue(req.body.genre);

  const logoPath = (req.files as any)['logo'][0].path;
  const backPath = (req.files as any)['background'][0].path;

  const logo = await CloudinaryApi.upload(logoPath);
  const background = await CloudinaryApi.upload(backPath);
  fs.unlinkSync(logoPath);
  fs.unlinkSync(backPath);

  const prod = {
    ...req.body,
    platform: platformItem.key,
    genre: genreItem.key,
    logo: logo.url,
    background: background.url
  };

  return prod;
}
