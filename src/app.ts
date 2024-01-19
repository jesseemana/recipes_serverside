require('express-async-errors')
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import responseTime from 'response-time'
import { database } from './utils'
import { restResponseTimeHistogram } from './utils/metrics'
import { initialize_server, configure_middleware} from './server'
import { authRoute, recipesRoute, bookmarksRoute, userRoute } from './routes'

dotenv.config()

const app = express()

configure_middleware(app)

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
app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200))
//routes
app.use('/api/v2/auth', authRoute)
app.use('/api/v2/users', userRoute)
app.use('/api/v2/recipes', recipesRoute)
app.use('/api/v2/bookmarks', bookmarksRoute)
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

initialize_server(app, database)