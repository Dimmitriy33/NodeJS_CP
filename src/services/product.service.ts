import ProductModel, { ProductDocument } from '../models/product.model';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import { QueryOptions } from 'winston';

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

export async function deleteProduct(id: number) {
  return await ProductModel.findByIdAndDelete(id);
}

export async function softDeleteProduct(id: string) {
  return await ProductModel.findByIdAndUpdate(id, { isDeleted: true });
}
