/* eslint-disable no-unused-vars */
import 'express';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      token: string;
    }
  }
}
