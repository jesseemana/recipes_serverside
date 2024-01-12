import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { corsOptions } from '../utils'
import deserializeuser from '../middleware/auth.middleware'

const configure_middleware = (app: Application): void => {
  //@ts-ignore
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(cookieParser());
  app.use(deserializeuser);
  app.use(express.json({ limit: '5MB' }));
  app.use(express.urlencoded({ limit: '5MB', extended: true }));
}

export default configure_middleware 
