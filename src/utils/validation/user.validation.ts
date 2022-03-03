import { object, string, TypeOf } from "zod";

export const createUserValidationSchema = object({
  body: object({
    name: string({
      required_error: "Name is required!"
    }),

    password: string({
      required_error: "Password is required!"
    })
    .min(6, "Password must have at least 6 characters!"),

    passwordConfirmation: string({
      required_error: "Password confirmation is required!"
    }),

    email: string({
      required_error: "Email is required!"
    })
    .email("Not a valid email"),

  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and confirmPassword do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserValidationSchema>,
  "body.passwordConfirmation"
>;