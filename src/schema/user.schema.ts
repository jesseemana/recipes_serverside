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
    }).regex(new RegExp(".*[A-Z].*"), "One uppercase character").regex(new RegExp(".*[a-z].*"), "One lowercase character")
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"One special character")
      .min(8, "Must not be less than 8 characters.")
      .max(64, "Cannot be more than 64 characters long."),
    confirm_password: string({
      required_error: 'Password confirmation is required',
    }).regex(new RegExp(".*[A-Z].*"), "One uppercase character").regex(new RegExp(".*\\d.*"), "One number")
      .regex(new RegExp(".*[a-z].*"), "One lowercase character")
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"One special character")
      .min(8, "Must not be less than 8 characters.")
      .max(64, "Cannot be more than 64 characters long."),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email').toLowerCase(),
  }).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }),
})


export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email').toLowerCase(),
    password: string({
      required_error: 'Password is required',
    }).regex(new RegExp(".*[A-Z].*"), "One uppercase character").regex(new RegExp(".*\\d.*"), "One number")
      .regex(new RegExp(".*[a-z].*"), "One lowercase character")
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"One special character")
      .min(8, "Must not be less than 8 characters.")
      .max(64, "Cannot be more than 64 characters long."),
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body']
