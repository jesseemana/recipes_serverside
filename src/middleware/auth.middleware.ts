import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

const deserializeuser = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s/,"")

  if (!token) return next()

  const decoded = verifyToken(token, 'accessTokenPublicKey')

  if (decoded) {
    res.locals.user = decoded
  } 

  return next()
}

export default deserializeuser  
