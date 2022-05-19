import ProductRatingModel, { ProductRatingDocument } from '../models/productRating.model';
import { DocumentDefinition, FilterQuery, QueryOptions } from 'mongoose';

export async function createProductRating(
  productRating: DocumentDefinition<Omit<ProductRatingDocument, 'createdAt' | 'updatedAt'>>
) {
  return await ProductRatingModel.create(productRating);
}

export async function getProductRating(query: FilterQuery<ProductRatingDocument>) {
  return await ProductRatingModel.findOne(query).lean();
}

export async function getProductRatings(query: FilterQuery<ProductRatingDocument>, options?: QueryOptions) {
  return await ProductRatingModel.find(query, null, options).lean();
}
