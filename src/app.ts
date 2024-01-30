require('express-async-errors')
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import responseTime from 'response-time'
import { Database, swaggerDocs } from './utils'
import { restResponseTimeHistogram } from './utils/metrics'
import { initialize_server, configure_middleware} from './server'
import { 
  auth_route, 
  user_route, 
  recipes_route, 
  bookmarks_route, 
} from './routes'

dotenv.config()

const app = express()
const database = Database.getInstance()

configure_middleware(app)

swaggerDocs(app, Number(process.env.PORT))

/**
 * @openapi
 * '/health-check':
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: Server is responding and is up and running
 */
app.get('/health-check', (_: Request, res: Response) => res.sendStatus(200))
//routes
app.use('/api/v2/auth', auth_route)
app.use('/api/v2/users', user_route)
app.use('/api/v2/recipes', recipes_route)
app.use('/api/v2/bookmarks', bookmarks_route)
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
