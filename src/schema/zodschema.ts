import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    first_name: string({
      required_error: 'First name is required',
    }),
    last_name: string({
      required_error: 'Last name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password is too short - should be min 6 chars'),
    confirm_password: string({
      required_error: 'Password confirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }),
})


export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
