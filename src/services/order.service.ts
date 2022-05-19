import OrderModel, { OrderDocument } from '../models/order.model';
import { DocumentDefinition, FilterQuery, QueryOptions } from 'mongoose';

export async function createOrderItem(orderItem: DocumentDefinition<Omit<OrderDocument, 'createdAt' | 'updatedAt'>>) {
  return await OrderModel.create(orderItem);
}

export async function createOrderItems(
  orderItems: DocumentDefinition<Omit<OrderDocument, 'createdAt' | 'updatedAt'>>[]
) {
  return await OrderModel.insertMany(orderItems);
}
