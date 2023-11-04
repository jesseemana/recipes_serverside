import jwt from 'jsonwebtoken'
import config from 'config'

export const signJwt = (
  object: Object, 
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', 
  options?: jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')

  const token = jwt.sign(object, signingKey, { 
  ...(options && options), 
  algorithm: 'RS256'
  })

  return token
}

export const verifyToken = (token: string, verifyKey: 'accessTokenPublicKey' | 'refreshTokenPublicKey') => {
  const publicKey = Buffer.from(config.get<string>(verifyKey), 'base64').toString('ascii')

  try {
    const decoded = jwt.verify(token, publicKey)
    return decoded
  } catch(e) {
    return null
  }
}
