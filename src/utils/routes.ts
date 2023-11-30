import { Express } from 'express'
import authRouter from '../routes/auth.route'
import recipesRoute from '../routes/recipes.route'
import bookmarksRoute from '../routes/bookmarks.route'
import resetRoute from '../routes/reset.route'

const routes = (app: Express) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/recipes', recipesRoute);
  app.use('/api/v1/bookmarks', bookmarksRoute);
  app.use('/api/v1/reset', resetRoute);
};

export default routes
