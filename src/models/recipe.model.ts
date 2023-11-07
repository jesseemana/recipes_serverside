import { User } from './user.model'
import { prop, getModelForClass, Ref } from '@typegoose/typegoose'

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

  @prop()
  cloudinary_id: string
}

const RecipeModel = getModelForClass(Recipe, {
  schemaOptions: {
    timestamps: true
  }
})

export default RecipeModel
