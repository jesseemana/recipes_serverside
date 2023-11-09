import { object, string, TypeOf } from 'zod'

export const resetAuthSchema = object({
  params: object({
    id: string({
      required_error: 'id is required'
    }),
    token: string({
      required_error: 'Provide the token'
    })
  }),
  body: object({
    email: string({
      required_error: 'Please provide an email'
    }).email('Enter a valid email'),
    password: string({
      required_error: 'Please provide an email'
    }).min(6, 'Password is too short - should be min 6 chars'),
    confirm_password: string({
      required_error: 'Please provide an email'
    }).min(6, 'Password is too short - should be min 6 chars'),
  }).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }),
})

export type ResetAuthInput = TypeOf<typeof resetAuthSchema>
