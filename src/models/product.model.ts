import mongoose from 'mongoose';
import { Platforms } from '../types/productTypes';
import { OrderDocument } from './order.model';
import { ProductRatingDocument } from './productRating.model';

export interface ProductDocument extends mongoose.Document {
  name: string;
  platform: Platforms;
  dateCreated: Date;
  totalRating: number;
  genre: number;
  logo: number;
  background: number;
  price: number;
  count: number;
  isDeleted: number;
  ratings: ProductRatingDocument['_id'];
  ordersList: OrderDocument['_id'];
}

const productSchema = new mongoose.Schema(
  {
    ratings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductRating'
    },
    isValid: {
      type: Boolean,
      default: true
    },
    // to store user browser
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
export default ProductModel;
