import { Router } from "express";
import { getManager } from "typeorm";
import { v4 as uuid } from "uuid";

import { wrap, encrypt, makeHash, makeSession } from "../utils";
import { UserEntity, SessionEntity } from "../entities";

export const authRouter = Router();

authRouter.post(
  "/api/signup",
  wrap(async (req, res) => {
    const email: string = req.body.email || "";
    const password: string = req.body.password || "";

    if (!email || !password) {
      res.sendStatus(400);
      return;
    }

    let encryptedEmail = "";
    encryptedEmail = encrypt(email);
    const mgr = getManager();

    const user = await mgr.findOne(UserEntity, {
      encryptedEmail: encryptedEmail,
    });

    if (user) {
      res.sendStatus(409);
      return;
    }

    const salt = uuid();
    const result = await mgr.save(UserEntity, {
      id: uuid(),
      encryptedEmail,
      salt,
      passwordHash: makeHash(password, salt),
    });

    const token = await makeSession(result.id);

    res.status(201).json({ token });
  })
);

// ログイン処理
authRouter.post(
  "/api/signin",
  wrap(async (req, res) => {
    const email: string = req.body.email || "";
    const password: string = req.body.password || "";
    if (!email || !password) {
      res.sendStatus(400);
      return;
    }

    const encryptedEmail = encrypt(email);

    const mgr = getManager();
    const user = await mgr.findOne(UserEntity, { encryptedEmail });
    if (!user) {
      res.sendStatus(404);
      return;
    }

    // 同一の文字を同じhash関数でhash化するから得られる文字は同じになる
    if (user.passwordHash !== makeHash(password, user.salt)) {
      res.sendStatus(403);
      return;
    }

    const token = await makeSession(user.id);
    res.header("Set-Cookie", `session_token=${token};`);
    res.status(200);
  })
);

// ログアウト機能
authRouter.post(
  "/api/singout",
  wrap(async (req, res) => {
    const userId: string = req.userId || "";
    const token: string = req.token || "";
    if (!userId || !token) {
      res.status(403);
      return;
    }
    const mgr = getManager();
    await mgr.delete(SessionEntity, { userId: userId, token: token });
    res.sendStatus(204);
  })
);
