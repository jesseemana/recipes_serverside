import { object, string, TypeOf, z } from 'zod'

export const createRecipeSchema = object({
  name: string({
    required_error: 'Recipe name is required',
  }).trim(),
  time: string({
    required_error: 'Time to prepare is required',
  }).trim(),
  category: z.enum(['breakfast', 'main course', 'snack', 'desert']),
  procedure: string({
    required_error: 'Procedure is required',
  }).trim(),
  ingridients: string({
    required_error: 'Ingridients are required',
  }).trim(),
})

export const updateRecipeSchema = object({
  params: object({
    id: string({
      required_error: 'Recipe id is required'
    }).trim()
  }),
  body: object({
    name: string({
      required_error: 'Recipe name is required',
    }).trim(),
    time: string({
      required_error: 'Time to prepare is required',
    }).trim(),
    category: z.enum(['breakfast', 'main course', 'snack', 'desert']),
    procedure: string({
      required_error: 'Procedure is required',
    }).trim(),
    ingridients: string({
      required_error: 'Ingridients are required',
    }).trim()
  })
})

export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>
export type UpdateRecipeInput = TypeOf<typeof updateRecipeSchema>
