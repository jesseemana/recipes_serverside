const mongoose = require('mongoose')

const { Schema, model } = mongoose

const recipeSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId,required: true,ref: 'User' },
    name: { type: String, required: true },
    ingridients: { type: String,required: true },
    procedure: { type: String,required: true },
    category: { type: String,required: true },
    picture_path: { type: String,required: true },
    cloudinary_id: { type: String, },
    time: { type: String,required: true }
  },
  {
    timestamps: true
  }
)

module.exports = model('Recipe', recipeSchema) 