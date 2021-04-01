import { wrap } from '../utils/wrap';
import { Router } from 'express';

export const helloRouter = Router();

helloRouter.get(
  '/api/hello',
  wrap(async (req, res) => {
    res.status(200);
    res.json({ hoge: 'apple' });
  })
);
