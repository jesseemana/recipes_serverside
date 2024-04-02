import dayjs from 'dayjs';
import logger from 'pino';
import config from 'config';

const level = config.get<string>('logLevel');

// NB: don't use pino-pretty in production
const log = logger({
  level,
  transport: { target: 'pino-pretty', },
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
 
export default log;
