import { Request, Response, NextFunction } from "express";

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export const wrap = (fn: RouteHandler): RouteHandler => (req, res, next) =>
  fn(req, res, next).catch(next);
