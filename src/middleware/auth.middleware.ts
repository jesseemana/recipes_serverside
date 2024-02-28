import { Request, Response, NextFunction } from 'express'
import { Jwt } from '../utils'

const deserialize_user = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s/,"")
  if (!token) return next()
  const decoded = Jwt.verifyToken(token, String(process.env.ACCESS_TOKEN_PUBLIC_KEY))
  if (decoded) { res.locals.user = decoded } 

  return next()
}

export default deserialize_user  
