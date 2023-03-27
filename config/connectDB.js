const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/Recipes'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch(err) {
        console.log(err)
    }
}

module.exports = connectDB