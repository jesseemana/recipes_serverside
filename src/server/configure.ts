import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import corsOptions from '../utils/corsOptions'
import deserializeuser from '../middleware/auth.middleware'


function configureServer (app: Application): void {
  
  //@ts-ignore
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(cookieParser());
  app.use(deserializeuser);
  app.use(express.json({ limit: '50MB' }));
  app.use(express.urlencoded({ limit: '50MB', extended: true }));

}

export default configureServer 
