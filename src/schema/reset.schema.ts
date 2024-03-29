import { object, string, TypeOf } from 'zod'

export const resetAuthSchema = object({
  email: string({
    required_error: 'Please provide an email'
  }).email('Enter a valid email').trim().toLowerCase(),
})

export const updateAuthSchema = object({
  params: object({
    id: string({
      required_error: 'id is required'
    }).trim(),
    token: string({
      required_error: 'Provide the token'
    }).trim()
  }),
  body: object({
    new_password: string({
      required_error: 'Please provide a password'
    }).regex(new RegExp(".*[A-Z].*"), "One uppercase character").regex(new RegExp(".*\\d.*"), "One number")
      .regex(new RegExp(".*[a-z].*"), "One lowercase character")
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"One special character")
      .min(8, "Must not be less than 8 characters.")
      .max(64, "Cannot be more than 64 characters long."),
    confirm_password: string({
      required_error: 'Please confirm your password'
    }).regex(new RegExp(".*[A-Z].*"), "One uppercase character").regex(new RegExp(".*\\d.*"), "One number")
      .regex(new RegExp(".*[a-z].*"), "One lowercase character")
      .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),"One special character")
      .min(8, "Must not be less than 8 characters.")
      .max(64, "Cannot be more than 64 characters long."),
  }).refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  }),
})

export type ResetAuthInput = TypeOf<typeof resetAuthSchema>
export type UpdateAuthInput = TypeOf<typeof updateAuthSchema>
