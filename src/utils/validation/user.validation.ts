import { object, string, TypeOf } from 'zod';

export const createUserValidationSchema = object({
  body: object({
    userName: string({
      required_error: 'userName is required!'
    })
      .min(6, 'userName must be at most 32 characters!')
      .max(32, 'userName must be at least 6 characters!'),

    password: string({
      required_error: 'Password is required!'
    }).min(6, 'Password must have at least 6 characters!'),

    passwordConfirmation: string({
      required_error: 'Password confirmation is required!'
    }),

    email: string({
      required_error: 'Email is required!'
    }).email('Not a valid email'),

    phoneNumber: string({
      required_error: 'Phone number is required!'
    }).regex(/\d{3}-\d{3}-\d{4}/, 'Not a valid phone number!'),

    addressDelivery: string({
      required_error: 'Address delivery is required!'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and confirmPassword do not match',
    path: ['passwordConfirmation']
  })
});

export type CreateUserInput = Omit<TypeOf<typeof createUserValidationSchema>, 'body.passwordConfirmation'>;
