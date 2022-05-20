import { object, string, TypeOf, any, number } from 'zod';
import { enumToKeysArray, enumToValuesArray } from '../../helpers/enumToArray';
import { getNumberOrNull } from '../../helpers/getValueOrNull';
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
  }).refine((v) => (enumToKeysArray(GamesGenres) as string[]).map((g) => g.toLowerCase()).includes(v.toLowerCase()), {
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
    isDeleted: string()
      .optional()
      .transform((v) => (v != null ? Boolean(v) : undefined))
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

export const productSelectionValidationSchema = object({
  query: object({
    filterType: string()
      .optional()
      .refine((v) => !v || ['Genre', 'Age'].includes(v), {
        message: 'Filter type is not valid!'
      }),

    filterValue: string()
      .optional()
      .refine(
        (v) =>
          !v ||
          (enumToKeysArray(GamesGenres) as string[]).map((g) => g.toLowerCase()).includes(v.toLowerCase()) ||
          enumToValuesArray(GamesRating).includes(Number(v)),
        {
          message: 'Filter value is not valid!'
        }
      ),

    sortField: string()
      .optional()
      .refine((v) => !v || ['Rating', 'Price'].includes(v), {
        message: 'Sort field is not valid!'
      }),

    orderType: string()
      .optional()
      .refine((v) => !v || ['Asc', 'Desc'].includes(v), {
        message: 'Order type is not valid!'
      }),

    limit: string()
      .optional()
      .transform((v) => getNumberOrNull(v))
      .refine((v) => !v || (Number(v) > 0 && Number(v) < 1000), {
        message: 'Limit must be greater than 0 and less than 1000!'
      }),

    offset: string()
      .optional()
      .transform((v) => getNumberOrNull(v))
      .refine((v) => !v || (Number(v) > 0 && Number(v) < 100), {
        message: 'Offset must be greater than 0 and less than 100!'
      })
  })
});

export const productRatingActionValidationSchema = object({
  body: object({
    productId: string({
      required_error: 'Product id is required!'
    }),

    rating: number({
      required_error: 'Rating is required!'
    })
  })
});

export type CreateProductInput = TypeOf<typeof createProductValidationSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductValidationSchema>;
export type GetProductInput = TypeOf<typeof getProductValidationSchema>;
export type SearchProductsInput = TypeOf<typeof searchProductsByNameSchema>;
export type ProductSelectionInput = TypeOf<typeof productSelectionValidationSchema>;
export type ProductRatingActionInput = TypeOf<typeof productRatingActionValidationSchema>;
