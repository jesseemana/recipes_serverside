import mongoose, { ConnectOptions } from 'mongoose'
import log from './logger'
import config from 'config'

class ConnectDatabase {
  dbUri: string
  options: ConnectOptions

  constructor() {
    this.options = {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 4500,
    }

    this.dbUri = config.get<string>('dbUri')
  }

  connect() { 
    mongoose.connect(this.dbUri)

    mongoose.connection.on('connected', () => {
      log.info('Database connected...')
    })

    mongoose.connection.on('error', (error: string) => {
      log.error(`Error connecting to database: ${error}`)
    })

    mongoose.connection.on('disconnected', () => {
      log.warn('Mongoose database connection has been disconnected')
    })
  }

  disconnect() {
    mongoose.connection.close()
    log.warn('Database connection closed due to app termination')  
  }
}

const database = new ConnectDatabase()
export default database
