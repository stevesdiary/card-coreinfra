import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret: string = process.env.JWT_SECRET || 'secret';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!secret) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }
    const token = req.headers.authorization?.split(' ')[1] as string;

    if (!token) {
      res.status(401).send({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, secret ) as any;

    if (typeof decoded === 'string' || !decoded || !('role' in decoded)) {
      res.status(401).send({ error: 'Invalid token.' })
      return;
    }

    req.user = decoded;
    next();
  
  } catch (error) {
    console.error('AUTHENTICATION ERROR:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default authentication;
