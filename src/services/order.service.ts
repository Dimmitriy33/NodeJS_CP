import OrderModel, { OrderDocument } from '../models/order.model';
import { DocumentDefinition, FilterQuery, QueryOptions } from 'mongoose';
import { OrderStatus } from '../types/orderTypes';

export async function createOrderItem(orderItem: DocumentDefinition<Omit<OrderDocument, 'createdAt' | 'updatedAt'>>) {
  return await OrderModel.create(orderItem);
}

export async function createOrderItems(
  orderItems: DocumentDefinition<Omit<OrderDocument, 'createdAt' | 'updatedAt'>>[]
) {
  return await OrderModel.insertMany(orderItems);
}

export async function findOrderItemsByOrdersId(items: string[]) {
  return await OrderModel.find({ _id: { $in: items } }).lean();
}

export async function findOrderItemsByUserId(userId: string) {
  return await OrderModel.find({ userId }).lean();
}

export async function changeOrderItemsStatus(orderItemsId: string[], newStatus: OrderStatus) {
  return await OrderModel.updateMany({ _id: { $in: orderItemsId } }, { status: newStatus }).lean();
}

export async function deleteOrderItems(orderItemsId: string[]) {
  return await OrderModel.deleteMany({ _id: { $in: orderItemsId } }).lean();
}
