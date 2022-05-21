/* eslint-disable @typescript-eslint/ban-ts-comment */
import ProductModel, { ProductDocument } from '../models/product.model';
import { DocumentDefinition, FilterQuery, QueryOptions } from 'mongoose';
import { getGenreNameByValue, getPlatformNameByValue } from '../helpers/productHelpers';
import { getProductRatings } from './productRating.service';
import { getAvgNumValue } from '../helpers/arrayHelpers';
import { GamesGenres, Platforms } from '../types/productTypes';

export async function createProduct(
  product: DocumentDefinition<Omit<ProductDocument, 'createdAt' | 'updatedAt' | 'ratings' | 'ordersList'>>
) {
  return await ProductModel.create(product);
}

export async function findProduct(query: FilterQuery<ProductDocument>) {
  return await ProductModel.findOne(query).lean();
}

export async function findProducts(query: FilterQuery<ProductDocument>, options?: QueryOptions) {
  return await ProductModel.find(query, null, options).lean();
}

export async function searchProductsByName(term: string, limit: number, offset: number) {
  return await ProductModel.find(
    {
      name: { $regex: '^' + term },
      isDeleted: false
    },
    {},
    {
      limit,
      skip: offset
    }
  ).lean();
}

// TODO: Fix and implement
// export async function getTopPopularPlatforms(count: number) {
//   return await ProductModel.aggregate([
//     {
//       $group: {
//         _id: 'platform',
//         count: { $sum: 1 }
//       },
//       $sort: {
//         count: -1
//       },
//       $limit: count
//     }
//   ]);
// }

export async function updateProduct(
  query: FilterQuery<ProductDocument>, //
  update: DocumentDefinition<Omit<ProductDocument, 'createdAt' | 'updatedAt'>>, //
  options?: QueryOptions
) {
  return await ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(id: string) {
  return await ProductModel.findByIdAndDelete(id);
}

export async function softDeleteProduct(id: string) {
  return await ProductModel.findByIdAndUpdate(id, { isDeleted: true });
}

export async function sortAndFilterGames(
  limit: number | null,
  offset: number | null,
  filterType?: string,
  filterValue?: string,
  sortField?: string,
  orderType?: string
) {
  const products = await findProducts({
    isDeleted: false
  });

  let filteredProducts = products;

  if (filterType && filterValue) {
    filteredProducts = filteredProducts.filter((product) => {
      if (filterType === 'Genre') {
        return product.genre === getGenreNameByValue(filterValue).key;
      } else if (filterType === 'Age') {
        // @ts-ignore
        return product.rating === Number(filterValue);
      }
    });
  }

  if (sortField) {
    filteredProducts = filteredProducts.sort((a, b) => {
      const sortFLower = sortField.charAt(0).toLowerCase() + sortField.slice(1);
      // @ts-ignore
      if (a[sortField] < b[sortField] || a[sortFLower] < b[sortFLower]) {
        return orderType === 'asc' ? -1 : 1;
      }

      // @ts-ignore
      if (a[sortField] > b[sortField] || a[sortFLower] > b[sortFLower]) {
        return orderType === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  if (orderType?.toLowerCase() === 'desc') {
    filteredProducts.reverse();
  }

  const limitV = limit ? Number(limit) : filteredProducts.length;
  const offsetV = offset ? Number(offset) : 0;
  const result = filteredProducts.slice(offsetV, offsetV + limitV);

  return result.map((r) => ({
    ...r,
    platform: Platforms[r.platform],
    genre: GamesGenres[r.genre]
  }));
}

export async function changeProductRating(id: string) {
  const prRatings = await getProductRatings({});
  const elRatings = prRatings.filter((pr) => pr.productId.toString() === id).map((p) => p.rating);
  const newRating = getAvgNumValue(elRatings) || 0;

  //@ts-ignore
  return await updateProduct({ _id: id }, { rating: newRating });
}
