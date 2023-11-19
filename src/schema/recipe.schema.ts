import { object, string, TypeOf, any, z, number } from 'zod'


export const createRecipeSchema = object({
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
})


export const fileSchema = object({
  file: object({
    fieldname: string(),
    originalname: string(),
    encoding: string(),
    mimetype: string(),
    size: number(),
  }),
});


export const updateRecipeSchema = object({
  params: object({
    id: string({
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


export const uploadPictureSchema = object({
  body: object({
    data: string({
      required_error: 'Provide picture base64 string'
    })
  })
})


export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>
export type UpdateRecipeInput = TypeOf<typeof updateRecipeSchema>
export type UploadPictureInput = TypeOf<typeof uploadPictureSchema>['body']
