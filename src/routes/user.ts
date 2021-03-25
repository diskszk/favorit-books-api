import { getUser, getUsers } from "../controller/users/getUsers";
import { wrap } from "../utils/wrap";
import { Router } from "express";
import { getManager } from "typeorm";

export const usersRouter = Router();

usersRouter.get(
  "/api/users",
  wrap(async (req, res) => {
    try {
      const users = await getUsers();

      if (!users) {
        console.log("取得できるユーザーが存在しません");
        res.sendStatus(404);
        return;
      }

      console.log("ユーザー一覧を取得しました");

      res.json(users);
    } catch (err) {
      throw new Error(err);
    }
  })
);

usersRouter.get(
  "/api/user",
  wrap(async (req, res) => {
    try {
      const userId = req.userId || "";
      const user = await getUser(userId);

      console.log("req", { req });

      console.log(`id: ${userId}`);

      if (!user) {
        console.log("取得できるユーザーが存在しません");
        res.sendStatus(404);
        return;
      }

      console.log("ユーザーを取得しました");

      res.json(user);
    } catch (err) {
      throw new Error(err);
    }
  })
);

usersRouter.get(
  "/api/",
  wrap(async (req, res) => {
    const hoge = "hoge";
    res.header("Set-Cookie", "hoge=" + hoge + ";");
    res.json([1, 2, 3, 4]);
  })
);

usersRouter.get(
  "/api/check",
  wrap(async (req, res) => {
    const cookie = req.header("set-cookie");
    console.log("cookie: ", cookie);
  })
);
