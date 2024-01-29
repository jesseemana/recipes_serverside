import { object, string, TypeOf } from 'zod'

// /**
//  * @openapi
//  * components:
//  *   schema:
//  *     GetBookmarks:
//  *       type: array
//  *       items:
//  *         type: object
//  *         required:
//  *           - user
//  *           - name
//  *           - time
//  *           - category
//  *           - procedure
//  *           - ingridients
//  *           - picture_path
//  *           - cloudinary_id
//  *         properties:
//  *           _id:
//  *             type: string
//  *           user:
//  *             type: string
//  *           name:
//  *             type: string
//  *           time:
//  *             type: string
//  *           category:
//  *             type: string
//  *           procedure:
//  *             type: string
//  *           ingridients:
//  *             type: string
//  *           picture_path:
//  *             type: string
//  *           cloudinary_id:
//  *             type: string
//  *           createdAt:
//  *             type: date
//  *           updatedAt:
//  *             type: date
//  *           __v:
//  *             type: number
//  */
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
