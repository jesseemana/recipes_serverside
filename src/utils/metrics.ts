import express, { Request, Response } from 'express'
import log from './logger'
import client from 'prom-client'

const app = express()

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code']
})

export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'database_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success']
})

export const startMetricsServer = () => {
  const collectDefaultMetrics = client.collectDefaultMetrics

  collectDefaultMetrics()

  app.get('/metrics', async (_: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType)

    return res.send(await client.register.metrics())
  })

  app.listen(9100, () => log.info('Metrics server started at http://localhost:9100'))
}
