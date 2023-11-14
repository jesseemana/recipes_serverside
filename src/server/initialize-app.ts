import { Application } from 'express'
import log from '../utils/logger'
import config from 'config'
import errorHandler from '../middleware/error-handler'

const cpus = require('os').cpus()
import cluster from 'cluster'

interface Database {
  connect: () => void
  disconnect: () => void
}

function initializeServer(app: Application, database: Database): Application {
  const PORT = config.get<number>('port')
  
  database.connect()

  app.use(errorHandler)
  
  const server = app.listen(PORT, () => {
    log.info(`Server running on port: ${PORT}...🚀`)
  })

  const signals = ['SIGTERM', 'SIGINT']

  const gracefulShutdown = (signal: string) => {
    process.on(signal, () => {
      log.info(`Shutting down..., received signal`, signal)

      server.close()

      database.disconnect()

      log.info('Sayonara...😥💤💤')
      
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
//   mongoose.connection.once('open', () => {
//     log.info(`Database connected...`);
//     app.listen(PORT, () => log.info(`Server #${process.pid} running on port: ${PORT}...`));
//   });
//   mongoose.connection.on('error', (err) => console.log(err));
// }
