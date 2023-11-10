import { Express } from 'express'
import authRouter from '../routes/auth.route'
import recipesRoute from '../routes/recipes.route'
import bookmarksRoute from '../routes/bookmarks.route'
import resetRoute from '../routes/user.route'

const configureRoutes = (app: Express) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/user', recipesRoute);
  app.use('/api/v1/bookmarks', bookmarksRoute);
  app.use('/api/v1/reset', resetRoute);
};

export default configureRoutes
