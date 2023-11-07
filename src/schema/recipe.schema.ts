import { object, string, TypeOf } from 'zod'

export const createRecipeSchema = object({
  body: object({
    user: string({
      required_error: 'Provide user field',
    }),
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
    }),
    picture_path: string({
      required_error: 'Provide picture path',
    }),
    cloudinary_id: string({
      required_error: 'Provide picture cloudinary id',
    })
  })
})

export const updateRecipeSchema = object({
  body: object({
    id: string({
      required_error: 'Recipe id is required',
    }),
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

export const deleteRecipeSchema = object({
  body: object({
    id: string({
      required_error: 'Recipe id is required',
    })
  })
})

export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>['body']
export type UpdateRecipeInput = TypeOf<typeof updateRecipeSchema>['body']
export type DeleteRecipeInput = TypeOf<typeof deleteRecipeSchema>['body']
