import mongoose from 'mongoose';
import { OrderStatus } from '../types/orderTypes';
import { UserDocument } from './user.model';
import { enumToValuesArray } from '../helpers/enumToArray';
import { ProductDocument } from './product.model';

export interface OrderDocument extends mongoose.Document {
  userId: UserDocument['_id'];
  productId: ProductDocument['_id'];
  createdAt: Date; // related to timestamps
  amount: number;
  status: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      enum: enumToValuesArray(OrderStatus),
      required: true,
      default: OrderStatus.Unpaid
    }
  },
  {
    timestamps: true
  }
);

const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
export default OrderModel;
