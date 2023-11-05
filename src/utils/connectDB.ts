import mongoose from 'mongoose'
import config from 'config'

export const connectDB = async () => {
  const dbUri = config.get<string>('dbUri')

  try {
    await mongoose.connect(dbUri)
  } catch(err) {
    console.log(err)
    process.exit(1)
  }
}
