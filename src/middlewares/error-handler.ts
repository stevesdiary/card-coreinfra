import { Request, Response, NextFunction } from 'express';
// import { BaseCustomError } from '../errors/custom-errors';

interface ErrorResponse {
  success: boolean;
  timestamp: string;
  errors: Array<{
    message: string;
    field?: string;
  }>;
  requestId?: string;
}


import { ValidationError } from 'yup';

export class AppError extends Error {
  statusCode: number;
  status: 'error' | 'fail';
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorResponse = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'fail',
      errors: err.errors
    });
  }

  console.error('🚨 UNEXPECTED ERROR:', err);
  
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong. Please try again later.'
  });
};

export const catchAsync = <T extends (req: Request, res: Response, next: NextFunction) => Promise<Response>>(
  fn: T
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
