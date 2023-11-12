import { Application } from 'express'
import log from '../utils/logger'
import config from 'config'
import { ConnectDatabase }  from '../utils/connect-db'
import errorHandler from '../middleware/error-handler'

const cpus = require('os').cpus()
import cluster from 'cluster'

function initializeApp(app: Application): void {
  const PORT = config.get<number>('port')

  const connect_db = new ConnectDatabase()
  
  connect_db.connect()
  
  app.use(errorHandler)
  
  app.listen(PORT, () => {
    log.info(`Server running on port: ${PORT}...`)
  })
}

export default initializeApp

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
