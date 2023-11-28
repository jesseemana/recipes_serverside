import { Application } from 'express'
import { Database } from '../../types'
import errorHandler from '../middleware/error-handler'
import config from 'config'
import log from '../utils/logger'
const cpus = require('os').cpus()
import cluster from 'cluster'

const initializeServer = (app: Application, database: Database): Application => {
  const PORT = config.get<number>('port')
  
  app.use(errorHandler)
  
  const server = app.listen(PORT, () => {
    database.connect()
    log.info(`Server running on port: ${PORT}...🚀`)
  })

  const signals = ['SIGTERM', 'SIGINT']

  const gracefulShutdown = (signal: string) => {
    process.on(signal, () => {
      log.info(`Received signal: ${signal}, shuting down...`)
      server.close()
      database.disconnect()
      log.info('Goodbye...😥💤💤')

      process.exit(0)
    })
  }

  for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i])
  }

  return app
}

export default initializeServer 

// if (cluster.isPrimary) {
//   log.info(`Master process ${process.pid} has started...`);
//   for (let i = 0; i < cpus.length; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     log.info(`Worker ${worker.process.pid} has died...`);
//     cluster.fork();
//   });
// } else {
//    Do stuff here
// }
