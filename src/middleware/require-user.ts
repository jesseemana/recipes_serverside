import { Request, Response, NextFunction } from 'express';

export const requireUser = (_req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) return res.sendStatus(401);
  next();
}
