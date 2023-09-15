const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { registerSchema, loginSchema } = require('../utils/schema')


const createUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body)
  if (error)
    return res.status(400).json({ message: error.details[0].message })

  const duplicate = await User.findOne({ email: value.email }).collation({ locale: 'en', strength: 2 }).lean().exec() 
  if (duplicate) 
    return res.status(409).json({ message: 'email already in use.' })

  const hashed_password = await bcrypt.hash(value.password, 10)

  const new_user = new User({
    first_name: value.first_name,
    last_name: value.last_name,
    email: value.email,
    password: hashed_password
  })

  await new_user.save()
  
  if (new_user) {
    return res.status(201).json({ message: `New user ${value.first_name} ${value.last_name} has been created.` })
  } else {
    res.status(400).json({ message: 'Invalid user data received.' })
  }
}


const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message })

  const user = await User.findOne({ email: value.email }).exec()
  if (!user) return res.status(401).json({ message: `User doesn't exist.` })
  const valid_password = await bcrypt.compare(value.password, user.password)
  if (!valid_password) return res.status(400).json({ message: `Invalid password.` })

  const access_token = jwt.sign(
    { 'email': user.email },
    process.env.ACCESS_TOKEN,
    { expiresIn: '1d' }
  )

  const refresh_token = jwt.sign(
    { 'email': user.email },
    process.env.REFRESH_TOKEN,
    { expiresIn: '7d' }
  )

  // SEND/STORE THE REFRESH TOKEN IN COOKIE 
  res.cookie('jwt', refresh_token, {
    httpOnly: true, // store refresh token in cookie, accessible only by web server not JS
    secure: process.env.NODE_ENV = 'development' ? false : true, // for http, set to true when not in dev mode(https)
    sameSite: 'None', // cross-site access
    maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to 7 days(same as refresh token)
  })

  res.status(200).json({ user, access_token }) 
}


const refresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized.' })

  const refresh_token = cookies.jwt

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN,
    async function (err, decoded) {
      if (err) return res.status(403).json({ message: 'Forbidden.' })
      const user = await User.findOne({ email: decoded.email }).exec() 
      if (!user) return res.status(401).json({ message: 'Unauthorized.' })
      const access_token = jwt.sign(
        {'email': user.email},
        process.env.ACCESS_TOKEN,
        {expiresIn: '1d'} // SHOULD HAVE THE SAME AGE AS ORIGINAL ACCESS TOKEN IN LOGIN e.g 10 SECONDS
      )
      res.json({ 'new_token': access_token })
    }
  )
}


// CLEAR THE REFESHTOKEN FROM THE COOKIE
const logout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No cookie, we're good either way
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  })
  
  res.json({ message: 'Cookie cleared.' })
}


module.exports = {
  createUser,
  login,
  refresh,
  logout
}    