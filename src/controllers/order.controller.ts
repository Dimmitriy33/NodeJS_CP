/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { createOrderItems } from '../services/order.service';
import { findProduct } from '../services/product.service';
import { OrderStatus } from '../types/orderTypes';
import { AddProdToOrderInput } from '../utils/validation/order.validation';
import { checkIsProductExist } from './product.controller';

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
