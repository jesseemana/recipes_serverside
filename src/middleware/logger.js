const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const logEvents = async (message, logFileName) => {
  const date = format(new Date(), 'ddMMyyyy\tHH:mm:ss') // date and time request was made
  const logItem = `${date}\t${uuid()}\t${message}\n` // the log details - (date, logID, and the message)
  try {
    // create logs folder if it doesn't exist 
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    // add the logItem into the logs folder 
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (error) {
    console.log(error)
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = { logEvents, logger };