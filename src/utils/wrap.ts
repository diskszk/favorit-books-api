import { Request, Response, NextFunction } from 'express';

type RouteHandler = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => Promise<void>;
export const wrap = (fn: RouteHandler): RouteHandler => (req, res, next) =>
  fn(req, res, next).catch(next);
