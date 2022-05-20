import { object, array, string, TypeOf, number } from 'zod';

export const addProductsToOrderValidationSchema = object({
  body: array(
    object({
      productId: string({
        required_error: 'Product ID is required!'
      }),

      amount: number({
        required_error: 'Amount is required!'
      })
    })
  )
});

export const orderListValidationSchema = object({
  query: object({
    orderList: array(string()).or(string()).optional()
  })
});

export type AddProdToOrderInput = TypeOf<typeof addProductsToOrderValidationSchema>;
export type OrderListInput = TypeOf<typeof orderListValidationSchema>;
