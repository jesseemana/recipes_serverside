const mongoose = require('mongoose');

const { Schema, model } = mongoose

const ReviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  recipe: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'recipes' },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = model('Review', ReviewSchema)    