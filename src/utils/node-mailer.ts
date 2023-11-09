import nodemailer, { SendMailOptions } from 'nodemailer'
import log from './logger'
import config from 'config'

const transporter = nodemailer.createTransport({
  host: 'gmail',
  auth: {
    user: config.get<string>('user'),
    pass: config.get<string>('pass')
  }
})

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending email')
      return
    }
  })
}

export default sendEmail
