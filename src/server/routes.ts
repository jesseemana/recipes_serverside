import { Express } from 'express'
import authRoute from '../routes/auth.route'
import recipesRoute from '../routes/recipes.route'
import bookmarksRoute from '../routes/bookmarks.route'
import userRoute from '../routes/user.route'

const configureRoutes = (app: Express) => {
  app.use('/api/v1/auth', authRoute)
  app.use('/api/v1/user', userRoute)
  app.use('/api/v1/recipes', recipesRoute)
  app.use('/api/v1/bookmarks', bookmarksRoute)
}

export default configureRoutes
