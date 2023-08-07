const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const createUser = async (req, res) => {
  const {first_name, last_name, email, password} = req.body
  if (!first_name || !last_name || !email || !password) 
    return res.status(400).json({message: 'Please fill out all fields'})

  const duplicate = await User.findOne({email}).collation({locale: 'en', strength: 2}).lean().exec() 
  if (duplicate) return res.status(409).json({message: 'email already in use'})

  const hashed_password = await bcrypt.hash(password, 10)

  const new_user = new User({
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: hashed_password
  })

  await new_user.save()
  
  if (new_user) {
    return res.status(201).json({message: `New user ${first_name} ${last_name} has been created`})
  } else {
    res.status(400).json({message: 'Invalid user data received'})
  }
}


const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) 
    return res.status(400).json({message: `Provide email and password`})
    
  const user = await User.findOne({email}).exec()
  if (!user) return res.status(401).json({message: `User doesn't exist`})
  const valid_password = await bcrypt.compare(password, user.password)
  if (!valid_password) return res.status(400).json({message: `Invalid password`})

  const access_token = jwt.sign(
    {'email': user.email},
    process.env.ACCESS_TOKEN,
    {expiresIn: '1d'}
  )
  const refresh_token = jwt.sign(
    {'email': user.email},
    process.env.REFRESH_TOKEN,
    {expiresIn: '7d'}
  )

  // STORE THE REFRESH TOKEN IN COOKIE(MEMORY) 
  res.cookie('jwt', refresh_token, {
    httpOnly: true, // store refresh token in memory, accessible only by web server not JS
    secure: false, // for http, set to true when not in dev mode(https)
    sameSite: 'None', // cross-site access
    maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to 7 days(same as refresh token)
  })

  res.status(200).json({user, access_token}) 
}


const refresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

  const refresh_token = cookies.jwt

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN,
    async function (err, decoded) {
      if (err) return res.status(403).json({message: 'Forbidden'})
      // decoding the refresh token
      const user = await User.findOne({email: decoded.email}).exec() 
      if (!user) return res.status(401).json({message: 'Unauthorized'})
      const access_token = jwt.sign(
        {'email': user.email},
        process.env.ACCESS_TOKEN,
        {expiresIn: '7d'}
      )
      res.json(access_token)
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
  
  res.json({message: 'Cookie cleared'})
}


module.exports = {
  createUser,
  login,
  refresh,
  logout
}       