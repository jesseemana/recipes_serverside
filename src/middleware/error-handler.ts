import { Request, Response, NextFunction } from 'express'
import { log } from '../utils'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error(err.stack)
  const status = res.statusCode ? res.statusCode : 500
  res.status(status)
  res.json({message: err.message})
}

export default errorHandler
