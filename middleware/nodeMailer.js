const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});

transporter.verify((error, succes) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready for message');
    console.log(succes);
  }
});

module.exports = transporter; 