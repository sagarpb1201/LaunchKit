import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let data: { success: boolean; message: string; errors?: any } = {
    success: false,
    message: 'Something went wrong',
  };

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    data.message = err.message;
    if (err.errors.length > 0) {
      data.errors = err.errors;
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    data.message = 'Validation failed';
    data.errors = err.issues.reduce((acc, issue) => {
      const fieldName = issue.path[issue.path.length - 1] as string;
      acc[fieldName] = acc[fieldName] ? [...acc[fieldName], issue.message] : [issue.message];
      return acc;
    }, {} as Record<string, string[]>);
  } else {
    // For any other error, log it and send a generic message
    console.error('UNHANDLED_ERROR:', err);
    data.message = err.message || 'An unexpected error occurred.';
  }

  return res.status(statusCode).json(data);
};

export { errorHandler };
