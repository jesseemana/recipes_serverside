const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  first_name: {
    type: String,
    min: 3,
    max: 20,
    required: true
  },
  last_name: {
    type: String,
    min: 3,
    max: 20,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bookmarks: {
    type: Array,
    default: []
  },
})

module.exports = mongoose.model('User', userSchema) 