import { object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *   schema:
 *     BookmarksResponse:
 *       type: array
 *       items:
 *         recipe_id:
 *           type: string
 */
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

export type BookmarksInput = TypeOf<typeof bookmarkRecipeSchema>['params']
