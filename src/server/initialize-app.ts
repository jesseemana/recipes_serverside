import dotenv from 'dotenv'
import { Express } from 'express'
import { error_handler } from '../middleware'
import { log, Database, swaggerDocs, startMetricsServer } from '../utils'

dotenv.config()

const initialize_server = (app: Express, database: Database) => {
  const PORT = Number(process.env.PORT)
  
  app.use(error_handler)
  
  const server = app.listen(PORT, () => {
    database.connect()
    swaggerDocs(app, PORT)
    startMetricsServer()
    log.info(`Server running at: http://localhost:${PORT}...🚀`)
  })

  const signals = ['SIGTERM', 'SIGINT']

  const gracefulShutdown = (signal: string) => {
    process.on(signal, () => {
      log.info(`Received signal: ${signal}, shutting down...`)
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

export default initialize_server

// import { cpus } from 'os'
// import cluster from 'cluster'
// import { once } from 'events'

// if (cluster.isPrimary) {
//   log.info(`Master process ${process.pid} has started...`);
//   const available_cpus = cpus()
//   available_cpus.forEach(() => cluster.fork())

//   cluster.on('exit', (worker, code) => {
//     if (code !== 0 && !worker.exitedAfterDisconnect) {
//       log.info(`Worker ${worker.process.pid} has died. Forking new worker...`);
//       cluster.fork();
//     }
//   });

//   process.on('SIGUSR2', async () => {
//     const workers = Object.values(cluster.workers)
//     for (const worker of workers) {
//       log.info(`Stopping worker: ${worker?.process.pid}`)
//       worker?.disconnect()
//       await once(worker, 'exit')
//       if (!worker?.exitedAfterDisconnect) continue
//       const newWorker = cluster.fork() // (4)
//       await once(newWorker, 'listening')
//     }
//   })
// } else {
//   // Do stuff here i.e. start server
// }