require('express-async-errors');
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import { initializeServer } from './server';
import { deserializeUser } from './middleware';
import { Database, swaggerDocs } from './utils';
import { restResponseTimeHistogram } from './utils/metrics';
import { authRoute, userRoute, recipeRoute, bookmarksRoute } from './routes';

const app = express();
const database = Database.getInstance();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(deserializeUser);
app.use(express.json({ limit: '5MB' }));
app.use(express.urlencoded({ limit: '5MB', extended: true }));

// Starting the swaggerDocs
swaggerDocs(app, Number(process.env.PORT) || 8080);

/**
 * @openapi
 * '/health-check':
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running.
 *     responses:
 *       200:
 *         description: Server is responding and is up and running.
 */
app.get('/health-check', (_req: Request, res: Response) => res.status(200).send('OK'));

// Routes
app.use('/api/v2/auth', authRoute);
app.use('/api/v2/users', userRoute);
app.use('/api/v2/recipes', recipeRoute);
app.use('/api/v2/bookmarks', bookmarksRoute);

// Recording metrics for API response time
app.use(responseTime((req: Request, res: Response, time: number) => {
  if (req.path) {
    restResponseTimeHistogram.observe(
      {
        method: req.method,
        route: req.path,
        status_code: res.statusCode
      }, 
      time * 1000 // converting time from milliseconds
    );
  }
}));

// Starting the server
initializeServer(app, database);
