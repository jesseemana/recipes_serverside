import { Request, Response, NextFunction } from 'express';
import { log } from '../utils';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  log.error(err.stack);
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);
  res.json({ message: err.message });
}
