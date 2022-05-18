import { object, string, TypeOf, any } from 'zod';
import { enumToKeysArray, enumToValuesArray } from '../../helpers/enumToArray';
import { GamesGenres, GamesRating, Platforms } from '../../types/productTypes';

const basicProductSchema = {
  name: string({
    required_error: 'Name is required!'
  }),

  platform: string({
    required_error: 'Platform is required!'
  }).refine((v) => (enumToKeysArray(Platforms) as string[]).includes(v), {
    message: 'Platform is not valid!'
  }),

  totalRating: string({
    required_error: 'Total rating is required!'
  })
    .min(0, 'Total rating must be greater than 0!')
    .max(10, 'Total rating must be less than 10!')
    .transform((v) => Number(v)),

  genre: string({
    required_error: 'Genre is required!'
  }).refine((v) => (enumToKeysArray(GamesGenres) as string[]).map((g) => g.toLowerCase()).includes(v), {
    message: 'Genre is not valid!'
  }),

  // rating
  rating: string({
    required_error: 'Rating is required!'
  })
    .refine((v) => enumToValuesArray(GamesRating).includes(Number(v)), {
      message: 'Rating is not valid!'
    })
    .transform((v) => Number(v)),

  price: string({
    required_error: 'Price is required!'
  })
    .min(0, 'Price must be greater than 0!')
    .transform((v) => Number(v)),

  count: string({
    required_error: 'Count is required!'
  })
    .min(0, 'Count must be greater than 0!')
    .transform((v) => Number(v))
};

const createProductValidationSchemaModel = { ...basicProductSchema, logo: any(), background: any() };
export const createProductValidationSchema = object({
  body: object(createProductValidationSchemaModel)
});

export const updateProductValidationSchema = object({
  body: object({
    ...createProductValidationSchemaModel,
    id: string({
      required_error: 'Id is required!'
    }),
    isDeleted: string({
      required_error: 'Is deleted is required!'
    }).transform((v) => Boolean(v))
  })
});

export const getProductValidationSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required!'
    })
  })
});

export const searchProductsByNameSchema = object({
  query: object({
    term: string({
      required_error: 'Name is required!'
    }),
    limit: string({
      required_error: 'Limit is required!'
    })
      .refine((v) => Number(v) > 0, {
        message: 'Limit must be greater than 0!'
      })
      .transform((v) => Number(v)),
    offset: string({
      required_error: 'Offset is required!'
    })
      .refine((v) => Number(v) >= 0, {
        message: 'Offset must be greater than 0!'
      })
      .transform((v) => Number(v))
  })
});

export type CreateProductInput = TypeOf<typeof createProductValidationSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductValidationSchema>;
export type GetProductInput = TypeOf<typeof getProductValidationSchema>;
export type SearchProductsInput = TypeOf<typeof searchProductsByNameSchema>;
