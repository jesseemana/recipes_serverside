import { Express } from 'express'
import authRoute from '../routes/auth.route'
import recipesRoute from '../routes/recipes.route'
import bookmarksRoute from '../routes/bookmarks.route'
import userRoute from '../routes/user.route'
import sessionsRoute from '../routes/session.route'

const configureRoutes = (app: Express) => {
  app.use('/api/v1/sessions', sessionsRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/recipe', recipesRoute);
  app.use('/api/v1/bookmarks', bookmarksRoute);
  app.use('/api/v1/user', userRoute);
};

export default configureRoutes
