import { object, string, TypeOf } from 'zod';


// /**
//  * @openapi
//  * components:
//  *   schema:
//  *     CreateUserInput:
//  *       type: object
//  *       required:
//  *         - first_name
//  *         - last_name
//  *         - email       
//  *         - password
//  *         - confirm_password
//  *       properties:
//  *         first_name:
//  *           type: string
//  *           default: John
//  *         last_name:
//  *           type: string
//  *           default: Doe
//  *         email:
//  *           type: string
//  *           default: johndoe@example.com
//  *         password:
//  *           type: string
//  *           default: Password_1234
//  *         confirm_password
//  *           type: string
//  *           default: Password_1234
//  *     UserResponse:
//  *       type: object
//  *       required:
//  *         - first_name
//  *         - last_name
//  *         - email
//  *         - bookmarks
//  *       properties:
//  *         first_name
//  *           type: string
//  *         last_name
//  *           type: string
//  *         email
//  *           type: string
//  *         bookmarks
//  *           type: array
//  */
export const createUserSchema = object({
  body: object({
    first_name: string({
      required_error: 'First name is required.',
    }).toLowerCase().trim(),
    last_name: string({
      required_error: 'Last name is required.',
    }).toLowerCase().trim(),
    email: string({
      required_error: 'Email is required.',
    }).email('Enter a valid email.').toLowerCase().trim(),
    password: string({
      required_error: 'Password is required.',
    }).min(8, 'Must not be less than 8 characters.')
      .max(64, 'Cannot be more than 64 characters long.'),
    confirm_password: string({
      required_error: 'Password confirmation is required.',
    }).min(8, 'Must not be less than 8 characters.')
      .max(64, 'Cannot be more than 64 characters long.'),
  }).refine((data) => data.password === data.confirm_password, {
    message: `Passwords don't match.`,
    path: ['confirm_password'],
  }),
})


/*
  ======================================================= PASSWORD REGEX ================================================================
  .regex(new RegExp(".*\\d.*"), "One number")
  .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
  .regex(new RegExp(".*[a-z].*"), "One lowercase character")
  .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), "One special character")
*/


// /**
//  * @openapi
//  * components:
//  *   schema:
//  *     LoginUserInput:
//  *       type: object
//  *       required:
//  *         - email
//  *         - password
//  *       properties:
//  *         email:
//  *           type: string
//  *           default: johndoe@example.com
//  *         password:
//  *           type: string
//  *           default: Password_1234
//  *    loginResponse:
//  *      type: object
//  *      required:
//  *        - user
//  *        - accessToken
//  *      properties:
//  *        user:
//  *          type: object
//  *          required:
//  *            - first_name
//  *            - last_name
//  *            - email
//  *            - bookmarks
//  *          properties:
//  *            first_name:
//  *              type: string
//  *            last_name:
//  *              type: string
//  *            email:
//  *              type: string
//  *            bookmarks:
//  *              type: array
//  *        accessToken:
//  *          type: string
//  *    RefreshResponse:
//  *      type: object
//  *      required:
//  *        - accessToken
//  *      properties:
//  *        accessToken:
//  *          type: string
//  */
export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required.',
    }).email('Enter a valid email.').toLowerCase().trim(),
    password: string({
      required_error: 'Password is required.',
    }).min(8, 'Must not be less than 8 characters.')
      .max(64, 'Cannot be more than 64 characters long.'),
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];
