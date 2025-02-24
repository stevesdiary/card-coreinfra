import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

      if (typeof decoded === 'string' || !decoded || !('role' in decoded)) {
        res.status(401).json({ error: 'Invalid token structure' });
        return;
      }

      req.user = decoded;
      next();
    } catch (verifyError) {
      // Specific error handling for different JWT errors
      if (verifyError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          error: 'Token expired', 
          expiredAt: verifyError.expiredAt 
        });
        return;
      }

      if (verifyError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      res.status(401).json({ error: 'Authentication failed' });
      return;
    }
  
  } catch (error) {
    console.error('AUTHENTICATION MIDDLEWARE ERROR:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export default authentication;
