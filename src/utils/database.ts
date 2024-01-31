import mongoose, { ConnectOptions } from 'mongoose'
import log from './logger'
import dotenv from 'dotenv'

dotenv.config()

export class Database {
  protected readonly dbUri: string
  protected readonly options: ConnectOptions
  private static unique_instance: Database = new Database()
  
  private constructor() {
    this.options = {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }

    this.dbUri = String(process.env.MONGO_URI)
  }

  public static getInstance(): Database {
    return this.unique_instance
  }

  connect() { 
    mongoose.connect(this.dbUri)
    mongoose.connection.on('connected', () => {
      log.info('Database connected...')
    })
    mongoose.connection.on('error', (error: string) => {
      log.error(`Error connecting to database: ${error}.`)
    })
    mongoose.connection.on('disconnected', () => {
      log.warn('Database connection has been disconnected.')
    })
  }

  disconnect() {
    mongoose.connection.close(false)
    log.warn('Database connection closed due to app termination.')  
  }
}
