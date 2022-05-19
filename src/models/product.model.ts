import mongoose from 'mongoose';
import { GamesGenres, GamesRating, Platforms } from '../types/productTypes';
import { OrderDocument } from './order.model';
import { ProductRatingDocument } from './productRating.model';
import { enumToValuesArray } from '../helpers/enumToArray';

export interface ProductDocument extends mongoose.Document {
  name: string;
  platform: Platforms;
  createdAt: Date; // related to timestamps
  updatedAt: Date; // related to timestamps
  totalRating: number;
  genre: number;
  rating: number;
  logo: string;
  background: string;
  price: number;
  count: number;
  isDeleted: boolean;
  ratings?: ProductRatingDocument['_id'];
  ordersList?: OrderDocument['_id'];
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    platform: {
      type: Number,
      required: true,
      enum: enumToValuesArray(Platforms)
    },
    totalRating: {
      type: Number,
      required: true
    },
    genre: {
      type: Number,
      enum: enumToValuesArray(GamesGenres),
      required: true
    },
    rating: {
      type: Number,
      enum: enumToValuesArray(GamesRating),
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    },
    ratings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductRating',
      required: false
    },
    ordersList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    }
  },
  {
    timestamps: true
  }
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
export default ProductModel;
