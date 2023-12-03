import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import corsOptions from '../utils/cors-options'
import deserializeuser from '../middleware/auth.middleware'

const configureServer = (app: Application): void => {
  //@ts-ignore
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(cookieParser());
  app.use(deserializeuser);
  app.use(express.json({ limit: '5MB' }));
  app.use(express.urlencoded({ limit: '5MB', extended: true }));
}

export default configureServer 
