require('dotenv').config()
require('express-async-errors')
import express from 'express'
import configureRoutes from './server/routes'
import configureServer from './server/configure'
import initializeServer from './server/initialize-app'

const app = express()

configureServer(app)

configureRoutes(app)

initializeServer(app)
