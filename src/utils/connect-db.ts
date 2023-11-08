import mongoose, { ConnectOptions } from 'mongoose'
import config from 'config'
import log from './logger'

class ConnectDatabase{
  dbUri: string
  options: ConnectOptions

  constructor() {
    this.options = {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 4500,
      family: 4
    }

    this.dbUri = config.get<string>('dbUri')
  }

  connect() { 
    mongoose.connect(this.dbUri)

    mongoose.connection.on('connected', () => {
      log.info('Database connected...')
    })

    mongoose.connection.on('error', (error: string) => {
      log.error(`Error connecting database: ${error}`)
    })

    mongoose.connection.on('disconnected', () => {
      log.warn('Mongoose database connection has been disconnected')
    })

    process.on('SIGINT', () => {
      // @ts-ignore
      mongoose.connection.close(() => {
        log.warn('Mongoose default connection is closed due to app termination')
        process.exit(0)
      })
    })
  }
}

const connectDB = new ConnectDatabase()
export default connectDB
