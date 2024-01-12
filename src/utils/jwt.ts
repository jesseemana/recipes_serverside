import jwt from 'jsonwebtoken'

const signJwt = (
  object: Object, 
  keyName: string, 
  options?: jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(keyName, 'base64').toString('ascii')

  const token = jwt.sign(object, signingKey, { 
    ...(options && options), 
    algorithm: 'RS256'
  })

  return token
}

const verifyToken = <T>(token: string, verifyKey: string): T | null => {
  const publicKey = Buffer.from(verifyKey, 'base64').toString('ascii')

  try {
    const decoded = jwt.verify(token, publicKey) as T
    return decoded
  } catch(e) {
    return null
  }
}

export default {
  signJwt,
  verifyToken
}
