const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const auth_header = req.headers.authorization || req.headers.Authorization
  if (!auth_header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })

  const token = auth_header.split(' ')[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN,
    (err, decoded) => {
      if (err) return res.status(403).json({message: 'Forbidden'})
      req.user = decoded.email
      next()
    }
  )
}

module.exports = verifyJWT  