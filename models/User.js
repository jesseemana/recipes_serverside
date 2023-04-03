const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            min: 3,
            max: 20,
            required: true
        },
        lastName: {
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
        role: {
            type: String,
            default: 'User'
        }
    }
)

module.exports = mongoose.model('User', userSchema)