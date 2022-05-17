import { object, string, number, TypeOf, any } from 'zod';
import { enumToKeysArray, enumToValuesArray } from '../../helpers/enumToArray';
import { GamesGenres, GamesRating, Platforms } from '../../types/productTypes';

const basicProductSchema = {
  name: string({
    required_error: 'Name is required!'
  }),

  platform: string({
    required_error: 'Platform is required!'
  }).refine(
    (v) => {
      console.log(v);
      return (enumToKeysArray(Platforms) as string[]).includes(v);
    },
    {
      message: 'Platform is not valid!',
      path: ['platform']
    }
  ),

  totalRating: number({
    required_error: 'Total rating is required!'
  })
    .min(0, 'Total rating must be greater than 0!')
    .max(10, 'Total rating must be less than 10!'),

  genre: string({
    required_error: 'Genre is required!'
  }).refine((v) => (enumToKeysArray(GamesGenres) as string[]).includes(v), {
    message: 'Genre is not valid!',
    path: ['genre']
  }),

  // rating
  rating: number({
    required_error: 'Rating is required!'
  }).refine((v) => enumToValuesArray(GamesRating).includes(v), {
    message: 'Rating is not valid!',
    path: ['rating']
  }),

  price: number({
    required_error: 'Price is required!'
  }).min(0, 'Price must be greater than 0!'),

  count: number({
    required_error: 'Count is required!'
  }).min(0, 'Count must be greater than 0!')
};

export const createProductValidationSchema = object({
  body: object({ ...basicProductSchema, logo: any(), background: any() })
});

export const updateProductValidationSchema = object({
  body: object({
    ...basicProductSchema,
    id: string({
      required_error: 'Id is required!'
    }),
    logo: any().refine((v) => v == null, {
      message: 'Logo is not valid!',
      path: ['logo']
    }),
    background: any()
  })
});

export const getProductValidationSchema = object({
  body: object({
    ...basicProductSchema,
    logo: string({
      required_error: 'Logo is required!'
    }),
    background: string({
      required_error: 'Background is required!'
    })
  })
});

export type CreateProductInput = TypeOf<typeof createProductValidationSchema>;
export type UpdateUserInput = TypeOf<typeof updateProductValidationSchema>;
export type GetUserInput = TypeOf<typeof getProductValidationSchema>;
