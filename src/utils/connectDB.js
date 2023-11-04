const mongoose = require('mongoose')
const config = require('config')

const connectDB = async () => {
  const dbUri = config.get('dbUri')

  try {
    await mongoose.connect(dbUri)
  } catch(err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDB
