import { object, string, TypeOf } from 'zod'

export const getBookmarksSchema = object({
  id: string({
    required_error: 'User id is required'    
  }).trim()
})

export const bookmarkRecipeSchema = object({
  params: object({
    recipe_id: string({
      required_error: 'Recipe id is required'
    }).trim(),
    user_id: string({
      required_error: 'User id is required'
    }).trim(),
  })
})

export type GetBookmarksInput = TypeOf<typeof getBookmarksSchema>
export type HandleBookmarksInput = TypeOf<typeof bookmarkRecipeSchema>['params']
