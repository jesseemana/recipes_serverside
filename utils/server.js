import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { logger } from '../middleware/logger'
import corsOptions from '../config/corsOptions'

const createServer = () => {
  const app = express()

  app.use(logger)
  app.use(helmet())
  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use(express.json({ limit: '50MB' }))
  app.use(express.urlencoded({ limit: '50MB', extended: true }))

  return app
}

export default createServer   