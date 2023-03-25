const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            min: 3,
            max: 20,
            required: true
        },
        lastname: {
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
        role: {
            type: String,
            default: 'User'
        }
    }
);

module.exports = mongoose.model('User', userSchema);