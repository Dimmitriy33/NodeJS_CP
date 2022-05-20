/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import {
  changeOrderItemsStatus,
  createOrderItems,
  deleteOrderItems,
  findOrderItemsByOrdersId,
  findOrderItemsByUserId
} from '../services/order.service';
import { findProduct } from '../services/product.service';
import { OrderStatus } from '../types/orderTypes';
import { AddProdToOrderInput, OrderListInput } from '../utils/validation/order.validation';

const orderErrMsgs = {
  productNotFound: 'Product not found',
  orderNotFound: 'Order not found',
  notEnougnProducts: 'Not enough products in stock'
};

export async function addProductsToOrderHandler(req: Request<{}, {}, AddProdToOrderInput['body']>, res: Response) {
  const reqOrderItems = req.body;
  const userId = res.locals.user._id;

  for (let idx = 0; idx < reqOrderItems.length; idx++) {
    const el = reqOrderItems[idx];
    const p = await findProduct({
      _id: el.productId,
      isDeleted: false
    });

    if (!p) {
      return res.status(404).send({ message: orderErrMsgs.productNotFound });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (el.amount > p.amount) {
      return res.status(400).send({ message: orderErrMsgs.notEnougnProducts });
    }
  }

  const orderItems = reqOrderItems.map((item) => ({
    productId: item.productId,
    amount: item.amount,
    userId: userId,
    status: OrderStatus.Unpaid
  }));

  await createOrderItems(orderItems);
  return res.sendStatus(200);
}

export async function getOrderListHandler(req: Request<{}, {}, {}, OrderListInput['query']>, res: Response) {
  const data = req.query.orderList;

  if (!data) {
    const userId = res.locals.user._id;
    const result = await findOrderItemsByUserId(userId);
    return res.send(result);
  }

  const result = await findOrderItemsByOrdersId(Array.isArray(data) ? data : [data]);
  return res.send(result);
}

export async function softRemoveOrdersHandler(req: Request<{}, {}, {}, OrderListInput['query']>, res: Response) {
  const data = req.query.orderList;

  if (!data) {
    return res.sendStatus(400);
  }

  const result = await changeOrderItemsStatus(Array.isArray(data) ? data : [data], OrderStatus.Rejected);
  return res.send(result);
}

export async function hardRemoveOrdersHandler(req: Request<{}, {}, {}, OrderListInput['query']>, res: Response) {
  const data = req.query.orderList;

  if (!data) {
    return res.sendStatus(400);
  }

  const result = await deleteOrderItems(Array.isArray(data) ? data : [data]);
  return res.send(result);
}

export async function buySelectedProductsHandler(req: Request<{}, {}, {}, OrderListInput['query']>, res: Response) {
  const data = req.query.orderList;
  if (!data) {
    return res.sendStatus(400);
  }

  const result = await changeOrderItemsStatus(Array.isArray(data) ? data : [data], OrderStatus.Paid);
  return res.send(result);
}
