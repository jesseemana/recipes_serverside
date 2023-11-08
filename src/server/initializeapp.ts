import { Application } from 'express'
import log from '../utils/logger'
import config from 'config'
import connectDB  from '../utils/connectDB'
import errorHandler from '../middleware/errorHandler'

function initializeApp(app: Application): void {
  const PORT = config.get<number>('port')

  connectDB.connect()

  app.use(errorHandler)

  app.listen(PORT, () => log.info(`Server running on port: ${PORT}...`))
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