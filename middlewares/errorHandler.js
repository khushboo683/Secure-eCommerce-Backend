import { AppError } from '../utils/error.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // For unexpected errors
    console.error(err); 
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
