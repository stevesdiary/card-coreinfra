import { Request, Response, NextFunction } from 'express';

const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).send({ error: 'Access denied.' });
      return;
    }
    next();
  };
};

export default authorizeRole;
