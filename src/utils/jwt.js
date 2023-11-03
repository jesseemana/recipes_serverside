const jwt = require('jsonwebtoken')

const signJwt = (object, signingKey, options) => {

  const token = jwt.sign(object, signingKey, { 
  ...(options && options), 
  algorithm: 'RS256'
  })

  return token
}

const verifyToken = (token, verifyKey) => {
  try {
    const decoded = jwt.verify(token, verifyKey)
    return decoded
  } catch(e) {
    return null
  }
}

module.exports = {
  signJwt,
  verifyToken
}
