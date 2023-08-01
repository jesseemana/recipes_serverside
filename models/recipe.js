const mongoose = require('mongoose')

const { Schema } = mongoose

const recipeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  ingridients: {
    type: String,
    required: true
  },
  procedure: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  picture_path: {
    type: String,
    required: true
  },
  cloudinary_id: {
    type: String,
    required: true
  },
  up_vote: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  }},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Recipe', recipeSchema)