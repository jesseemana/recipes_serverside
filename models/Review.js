const mongoose = require('mongoose')

const { Schema } = mongoose

const ReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'recipes'
    },
    review: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Review', ReviewSchema)     