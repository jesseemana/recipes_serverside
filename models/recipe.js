const mongoose = require('mongoose');

const {Schema} = mongoose;

const recipeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        ingridients: [{
            type: String,
            required: true
        }],
        procedure: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: true
        }
    }, {
    timestamps: true
}
);

module.exports = mongoose.model('Recipe', recipeSchema);
