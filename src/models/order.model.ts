import mongoose from 'mongoose';
import { Platforms } from '../types/productTypes';
import { UserDocument } from './user.model';

export interface OrderDocument extends mongoose.Document {
  product: UserDocument['_id'];
  mame: string;
  platform: Platforms;
  dateCreated: Date;
  totalRating: number;
  Genre: number;
  Logo: number;
  Background: number;
  Price: number;
  Count: number;
  IsDeleted: number;
  // Ratings: number; // Related to ProductRatings table
  // OrdersList: number; // Related to Order table
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
export default OrderModel;
