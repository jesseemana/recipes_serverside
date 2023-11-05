import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
})

