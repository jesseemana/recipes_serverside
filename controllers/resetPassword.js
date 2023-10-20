const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const transporter = require('../utils/nodeMailer')


const sendLink = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Please provide an email adress.' })

  const user = await User.findOne({email}).exec()
  if (!user) return res.status(401).json({ message: `User doesn't exist.` })
  
  // create a one time link valid for 30 minutes 
  const SECRET_TOKEN = process.env.JWT_SECRET + user.password
  const token = jwt.sign({ 'email': user.email }, SECRET_TOKEN, { expiresIn: '30m' })
  const link = `https://gourmands-portal.vercel.app/reset-password/${user._id}/${token}` // FOR FRONTEND
  const dev_link = `http://localhost:8080/api/v1/reset/${user._id}/${token}` // FOR DEV MODE(POSTMAN)
  console.log(dev_link)   

  // NODEMAILER SETUP
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Change Your Password',
    html: `<p>Follow the link to change your password: <b>${link}</b></p> <br /> <p>This link expires in 30 minutes.</p>`
  }

  // await transporter.sendMail(mailOptions)

  res.status(200).json({ message: `Password reset link sent to users' email.` })
} 


const resetPassword = async (req, res) => {
  const { id, token } = req.params
  if (!id || !token || !req.body.password) 
    return res.status(400).json({ message: 'Please provide user id, token and password!' })

  const user = await User.findById(id)
  if (!user) return res.status(401).json({ message: `User doesn't exist.` })

  const SECRET_TOKEN = process.env.JWT_SECRET + user.password
  const new_password = bcrypt.hashSync(req.body.password, 10)

  jwt.verify(token, SECRET_TOKEN, async (err) => {
      if (err) return res.status(403).json({ message: 'Forbidden.' })
      user.password = new_password
      await user.save()
      res.status(200).json({ message: 'User password has been updated.' })
    }
  )
}    


module.exports = { sendLink, resetPassword }     