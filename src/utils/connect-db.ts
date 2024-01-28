import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import log from './logger'

dotenv.config()

export class Database {
  private readonly dbUri: string
  protected options: ConnectOptions
  private static unique_instance: Database

  constructor() {
    this.options = {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }

    this.dbUri = String(process.env.MONGO_URI)
  }

  public static getInstance(): Database {
    if (this.unique_instance === null ) {
      this.unique_instance = new Database()
    }
    return this.unique_instance
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
