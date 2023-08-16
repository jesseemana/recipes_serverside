const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const transporter = require('../utils/nodeMailer')


const forgotPassword = async (req, res) => {
  const {email} = req.body
  if (!email) 
    return res.status(400).json({'message': 'please provide an email adress.'})

  const user = await User.findOne({email}).exec()
  if (!user) 
    return res.status(401).json({'message': `User doesn't exist.`})

  // create a one time link valid for 10 minutes
  const secret = process.env.JWT_SECRET + user.password
  const token = jwt.sign({'email': user.email}, secret, {expiresIn: '10m'})
  const link = `http://localhost:5173/reset-password/${user._id}/${token}`
  console.log(link) // send this link users' email

  // NODEMAILER SETUP
  // const mailOptions = {
  //   from: process.env.AUTH_EMAIL,
  //   to: email,
  //   subject: 'Change Password',
  //   html: `<p>Please, tap on the link to change your password: <b>${link}</b></p>.<br /><p>This link expires in 10 minutes </p>.`
  // }

  // await transporter.sendMail(mailOptions)

  res.status(200).json({'message': `Password reset link sent to users' email.`})
} 


const resetPassword = async (req, res) => {
  const {id, token} = req.params
  const {password} = req.body
  if (!id || !token || !password) 
    return res.status(400).json({'message': 'Please provide user id, token and password.'})

  const user = await User.findById(id)
  if (!user) return res.status(401).json({'message': `User doesn't exist.`})
  console.log(user)

  const secret = process.env.JWT_SECRET + user.password
  
  const hashed_passord = await bcrypt.hash(password, 10)

  jwt.verify(
    token, 
    secret,
    async function (err, decoded) {
      if (err) return res.status(403).json({'message': 'Forbidded.'})
      user.password = hashed_passord
      await user.save()
      res.json(200).json({'message': 'User password has been updated.'})
    }
  )
}    


module.exports = {
  forgotPassword,
  resetPassword,
} 