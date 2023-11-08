import { object, string, TypeOf } from 'zod'

export const bookmarkRecipeSchema = object({
  params: object({
    recipeId: string({
      required_error: 'Recipe id is required'
    }),
    userId: string({
      required_error: 'User id is required'
    }),
  })
})

export type CreateBookmarksInput = TypeOf<typeof bookmarkRecipeSchema>['params']
