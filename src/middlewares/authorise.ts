import { Request, Response, NextFunction } from 'express';

const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Access denied.' });
      return;
    }
    next();
  };
};
export default authorizeRole;
