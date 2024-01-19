import dayjs from 'dayjs'
import logger from 'pino'
import config from 'config'

const level = config.get<string>('logLevel')

// NB: DON'T USE PINO PRETTY IN PRODUCTION
const log = logger({
  transport: {
    target: 'pino-pretty'
  },
  level,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
})
 
export default log
