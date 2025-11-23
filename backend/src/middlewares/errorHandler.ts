import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    details: err.details || null,
  });
};

export default errorHandler;