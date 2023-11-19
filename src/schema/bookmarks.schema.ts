import { object, string, TypeOf } from 'zod'

export const getBookmarksSchema = object({
  id: string({
    required_error: 'User id is required'    
  })
})

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

export type GetBookmarksInput = TypeOf<typeof getBookmarksSchema>
export type HandleBookmarksInput = TypeOf<typeof bookmarkRecipeSchema>['params']
