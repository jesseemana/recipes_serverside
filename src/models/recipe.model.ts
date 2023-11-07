import { User } from './user.model'
import { prop, getModelForClass, Ref, modelOptions, Severity } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

export class Recipe {
  @prop({ required: true, ref: () => User })
  user: Ref<User>

  @prop({ required: true })
  name: string

  @prop({ required: true })
  time: string

  @prop({ required: true })
  category: string

  @prop({ required: true })
  procedure: string

  @prop({ required: true })
  ingridients: string

  @prop({ required: true })
  picture_path: string

  @prop({ required: true })
  cloudinary_id: string
}

const RecipeModel = getModelForClass(Recipe)

export default RecipeModel
