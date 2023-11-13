import { Application } from 'express'
import log from '../utils/logger'
import config from 'config'
import { ConnectDatabase }  from '../utils/connect-db'
import errorHandler from '../middleware/error-handler'

const cpus = require('os').cpus()
import cluster from 'cluster'

function initializeServer(app: Application): void {
  const PORT = config.get<number>('port')

  const database = new ConnectDatabase()
  
  app.use(errorHandler)
  
  const server = app.listen(PORT, async () => {
    await database.connect()
    log.info(`Server running on port: ${PORT}...🚀`)
  })

  const signals = ['SIGTERM', 'SIGINT']

  const gracefulShutdown = (signal: string) => {
    process.on(signal, async() => {
      log.info(`Shutting down..., received signal`, signal)

      server.close()

      await database.disconnect()

      log.info('Sayonara...😥💤💤')
      
      process.exit(0)
    })
  }

  for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i])
  }
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
