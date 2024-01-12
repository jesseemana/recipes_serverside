require('express-async-errors')
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import responseTime from 'response-time'
import configureRoutes from './server/routes'
import configureServer from './server/configure'
import initializeServer from './server/initialize-app'
import database from './utils/connect-db'
import { restResponseTimeHistogram } from './utils/metrics'

dotenv.config()

const app = express()
configureServer(app)

/**
 * @openapi
 * /api/healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

// recording promethius metrics 
app.use(responseTime((req: Request, res: Response, time: number) => {
  if (req.route.path) {
    restResponseTimeHistogram.observe(
      {
        method: req.method,
        route: req.route.path,
        status_code: res.statusCode
      }, 
      time * 1000
    )
  }
}))

configureRoutes(app)

initializeServer(app, database)
