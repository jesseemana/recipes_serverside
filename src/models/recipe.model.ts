import mongoose from 'mongoose'

const { Schema } = mongoose

const recipeSchema = new Schema(
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

const RecipeModel = mongoose.model('Recipe', recipeSchema) 

export default RecipeModel 