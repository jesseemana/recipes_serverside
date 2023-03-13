const {format} = require('date-fns')
const {v4: uuid} = require('uuid')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises


const logEvents = async (message, logFileName) => {
    const date = format(new Date(), 'ddMMyyyy\tHH:mm:ss') // date and time request was made
    const logItem = `${date}\t${uuid()}\t${message}\n` // the log details - (date, logID, and the message)

    try {
        // create logs folder if it doesn't exist 
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
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

module.exports = {logEvents, logger};


// const logEventss = async (message, logFileName) => {
//     const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
//     const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

//     try {
//         // CHECK IF LOGS FOLDER EXISTS, IF NOT CREATE IT 
//         if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
//             await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
//         }

//         // WRITING THE LOGS TO A LOGFILE
//         await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
//     } catch(err) {
//         console.log(err);
//     }
// };
