import { Request, Response, NextFunction } from 'express'
import log from '../utils/logger'
import { verifyToken } from '../utils/jwt'

const deserializeuser = (req: Request, res: Response, next: NextFunction) => {
  const auth_header = req.headers.authorization || req.headers.Authorization as string
  if (!auth_header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })

  const token = auth_header.split(' ')[1]
  log.info(token)
  if (!token) return next()

  const decoded = verifyToken(token, 'accessTokenPublicKey')
  log.info(decoded)
  if (decoded) {
    res.locals.user = decoded
  } 

  return next()
}

export default deserializeuser  
