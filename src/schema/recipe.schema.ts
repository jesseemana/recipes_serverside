import { object, string, TypeOf } from 'zod'

export const createRecipeSchema = object({
  body: object({
    name: string({
      required_error: 'Recipe name is required',
    }),
    time: string({
      required_error: 'Time to prepare is required',
    }),
    category: string({
      required_error: 'Recipe category is required',
    }),
    procedure: string({
      required_error: 'Procedure confirmation is required',
    }),
    ingridients: string({
      required_error: 'Ingridients are required',
    })
  })
})

export const updateRecipeSchema = object({
  params: object({
    recipeId: string({
      required_error: 'Recipe id is required'
    })
  }),
  body: object({
    name: string({
      required_error: 'Recipe name is required',
    }),
    time: string({
      required_error: 'Time to prepare is required',
    }),
    category: string({
      required_error: 'Recipe category is required',
    }),
    procedure: string({
      required_error: 'Procedure confirmation is required',
    }),
    ingridients: string({
      required_error: 'Ingridients are required',
    })
  })
})

export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>['body']
export type UpdateRecipeInput = TypeOf<typeof updateRecipeSchema>
