import { object, string, TypeOf } from 'zod'

export const bookmarkRecipeSchema = object({
  params: object({
    recipe_id: string({
      required_error: 'Recipe id is required'
    }),
    user_id: string({
      required_error: 'User id is required'
    }),
  })
})

export type CreateBookmarksInput = TypeOf<typeof bookmarkRecipeSchema>['params']
