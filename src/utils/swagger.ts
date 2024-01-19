import { Request, Response, Express } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'
import log from './logger'

const options: swaggerJsdoc.options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipes API',
      version
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Jwt'
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app.ts', './src/schema/*.ts', './src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  log.info(`Docs available at: http://localhost:${port}/docs`)
}

export default swaggerDocs
