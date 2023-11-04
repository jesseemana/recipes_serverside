import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface RecipeDocument extends mongoose.Document {
  user: UserDocument['_id']
  time: string
  name: string
  category: string
  procedure: string
  ingridients: string
  picture_path: string
  cloudinary_id: string
  createdAt: Date
  updatedAt: Date
}

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    time: { type: String,required: true },
    name: { type: String, required: true },
    category: { type: String,required: true },
    procedure: { type: String,required: true },
    ingridients: { type: String,required: true },
    picture_path: { type: String,required: true },
    cloudinary_id: { type: String, },
  },
  {
    timestamps: true
  }
)

const RecipeModel = mongoose.model<RecipeDocument>('Recipe', recipeSchema) 

export default RecipeModel 
