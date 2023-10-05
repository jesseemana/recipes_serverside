const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  first_name: { type: String, min: 3, max: 24, required: true },
  last_name: { type: String, min: 3, max: 24, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: { type: Array, default: [] },
})

module.exports = model('User', userSchema) 