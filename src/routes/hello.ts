import { wrap } from "../utils/wrap";
import { UserEntity } from "../entities";
import { Router } from "express";
import { getManager } from "typeorm";
import { decrypt } from "../utils/crypto";

export const helloRouter = Router();

helloRouter.get(
  "/api/hello",
  wrap(async (req, res) => {
    setTimeout(() => {
      res.status(200);
      res.json({ hoge: "apple" });
    }, 1000);
  })
);
