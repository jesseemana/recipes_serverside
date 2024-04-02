import { object, string, TypeOf, z } from 'zod';

export const createRecipeSchema = object({
  name: string({
    required_error: 'Recipe name is required.',
  }).toLowerCase().trim(),
  time: string({
    required_error: 'Time to prepare is required.',
  }).trim(),
  category: z.enum(['breakfast', 'main course', 'snack', 'desert']),
  procedure: string({
    required_error: 'Procedure is required.',
  }).toLowerCase().trim(),
  ingridients: string({
    required_error: 'Ingridients are required',
  }).toLowerCase().trim(),
});

export const getRecipeParamsSchema = object({
  params: object({
    user_id: string({
      required_error: 'User id is required.'
    }).trim()
  }),
});

export const updateRecipeSchema = object({
  params: object({
    id: string({
      required_error: 'Recipe id is required.'
    }).trim()
  }),
  body: object({
    name: string({
      required_error: 'Recipe name is required.',
    }).toLowerCase().trim(),
    time: string({
      required_error: 'Time to prepare is required.',
    }).trim(),
    category: z.enum(['breakfast', 'main course', 'snack', 'desert']),
    procedure: string({
      required_error: 'Procedure is required.',
    }).toLowerCase().trim(),
    ingridients: string({
      required_error: 'Ingridients are required',
    }).toLowerCase().trim()
  }),
});

export type CreateRecipeInput = TypeOf<typeof createRecipeSchema>;
export type GetRecipeParams = TypeOf<typeof getRecipeParamsSchema>;
export type UpdateRecipeInput = TypeOf<typeof updateRecipeSchema>;
