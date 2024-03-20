import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../utils';

export const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1].trim();
    const public_key = String(process.env.ACCESS_TOKEN_PUBLIC_KEY);
    const decoded = Jwt.verifyToken<{}>(token, public_key);
    if (decoded) { 
      res.locals.user = decoded; // alternative to req.user to avoid TS errors
    }
    return next();
  }
  return next();
}
