import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import jwtSimple from "jwt-simple";
import { createConnection, getManager, LessThan } from "typeorm";
import { NoteEntity, UserEntity, SessionEntity } from "./entities";

import dotenv from "dotenv";

dotenv.config();

async function main() {
  type RouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  const wrap = (fn: RouteHandler): RouteHandler => (req, res, next) =>
    fn(req, res, next).catch(next);

  const app = express();
  const port = process.env.SERVER_PORT;

  // サインアップ処理
  const jwtKey = process.env.JWT_KEY || "";
  const jwtAlgo = "HS256";

  const revokeOldSession = async (userId: string, exp: number) => {
    const threshold = new Date();
    threshold.setHours(threshold.getHours() - exp);
    const mgr = getManager();
    await mgr.delete(SessionEntity, { userId, createdAt: LessThan(threshold) });
  };

  const makeSession = async (userId: string): Promise<string> => {
    const exp = 12;
    const mgr = getManager();
    const result = await mgr.save(SessionEntity, {
      id: uuid(),
      userId,
      token: uuid(),
    });

    await revokeOldSession(userId, exp);

    const unixNow = new Date().getTime() / 1000;
    return jwtSimple.encode(
      {
        sub: uuid(),
        iat: Math.floor(unixNow),
        exp: Math.floor(unixNow + exp * 60 * 60),
        userId,
        token: result.token,
      },
      jwtKey,
      jwtAlgo
    );
  };

  // 暗号処理とハッシュ化

  const cryptoAlgo = "aes-256-cbc";
  const cryptoPassword = process.env.CRYPTO_PASSWORD || "";
  const cryptoSalt = process.env.CRYPTO_SALT || "";
  const cryptoKey = crypto.scryptSync(cryptoPassword, cryptoSalt, 32);
  const cryptoIv = process.env.CRYPTO_IV || "";

  const encrypt = (plaintext: string) => {
    if (plaintext === "") {
      return "";
    }
    const cipher = crypto.createCipheriv(cryptoAlgo, cryptoKey, cryptoIv);
    let ciphertext = cipher.update(plaintext, "utf8", "base64");
    ciphertext += cipher.final("base64");
    return ciphertext;
  };

  const decrypt = (ciphertext: string) => {
    if (ciphertext === "") {
      return "";
    }
    const decipher = crypto.createDecipheriv(cryptoAlgo, cryptoKey, cryptoIv);
    let plaintext = decipher.update(ciphertext, "base64", "utf8");
    plaintext += decipher.final("utf8");
    return plaintext;
  };

  const hashStretch = Number(process.env.HASH_STRETCH || null);

  const makeHash = (data: string, salt: string) => {
    let result = crypto
      .createHash("sha512")
      .update(data + salt)
      .digest("hex");
    for (let i = 0; i < hashStretch; i++) {
      result = crypto.createHash("sha512").update(result).digest("hex");
    }
    return result;
  };

  try {
    await createConnection({
      synchronize: true,
      type: "mysql" as const,
      host: process.env.DB_HOST || "",
      port: Number(process.env.DB_PORT || null),
      username: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "",
      entities: [NoteEntity, UserEntity, SessionEntity],
    });
  } catch (err) {
    console.error("DBとの接続に失敗しました。");
    throw new Error(err);
  }

  app.use(express.json());

  // 認証を付与
  app.use(
    wrap(async (req, res, next) => {
      if (/^\/api\/(signup|login)$/.test(req.path)) {
        next();
        return;
      }
      const parts = req.headers.authorization
        ? req.headers.authorization.split(" ")
        : "";
      const token =
        parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;
      if (!token) {
        res.sendStatus(403);
        return;
      }

      const payload = jwtSimple.decode(token, jwtKey, false, jwtAlgo);
      const mgr = getManager();
      const session = await mgr.findOne(SessionEntity, {
        token: payload.token,
        userId: payload.userId,
      });
      if (!session) {
        res.sendStatus(403);
        return;
      }

      req.userId = payload.userId;
      req.token = payload.token;
      next();
    })
  );

  app.get("/api/users", async (req, res) => {
    const mgr = getManager();
    const users = await mgr.find(UserEntity);
    res.json({ users });
  });

  app.get(
    "/api/hello",
    wrap(async (req, res) => {
      const mgr = getManager();
      const user = await mgr.findOne(UserEntity, { id: req.userId });
      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.json({ hello: decrypt(user.encryptedEmail) });
    })
  );

  // メモを追加する処理
  app.post(
    "/api/notes",
    wrap(async (req, res) => {
      const title: string = req.body.title || "";
      const body: string = req.body.body || "";

      if (!title || !body) {
        res.sendStatus(400);
        return;
      }

      const mgr = getManager();
      const result = await mgr.save(NoteEntity, {
        id: uuid(),
        title,
        body,
      });

      res.status(201).json(result);
    })
  );

  // メモを読み込む処理
  app.get(
    "/api/notes/:id",
    wrap(async (req, res) => {
      const id: string = req.params.id || "";

      if (!id) {
        res.sendStatus(400); // bad request
        return;
      }

      const mgr = getManager();
      const result = await mgr.findOne(NoteEntity, { id });

      if (!result) {
        res.sendStatus(404); // not found
        return;
      }
      res.status(200).json(result);
    })
  );

  // メモを削除する処理
  app.delete(
    "/api/notes/:id",
    wrap(async (req, res) => {
      const id: string = req.params.id || "";

      if (!id) {
        res.sendStatus(400);
        return;
      }
      const mgr = getManager();
      const result = await mgr.findOne(NoteEntity, { id });

      if (!result) {
        res.sendStatus(404);
        return;
      }

      await mgr.delete(NoteEntity, { id });
      res.sendStatus(204);
    })
  );

  // サインアップ処理
  app.post(
    "/api/signup",
    wrap(async (req, res) => {
      const email: string = req.body.email || "";
      const password: string = req.body.password || "";

      console.log("email", email);

      if (!email || !password) {
        res.sendStatus(400);
        return;
      }

      let encryptedEmail = "";
      try {
        encryptedEmail = encrypt(email);
      } catch (err) {
        console.error("encrypt err");
      }
      const mgr = getManager();
      try {
        const user = await mgr.findOne(UserEntity, { encryptedEmail });
        console.log("DB OK");

        if (user) {
          res.sendStatus(409);
          return;
        }
      } catch (err) {
        console.error("dbエラー");
      }

      const salt = uuid();
      try {
        const result = await mgr.save(UserEntity, {
          id: uuid(),
          encryptedEmail,
          salt,
          passwordHash: makeHash(password, salt),
        });

        const token = await makeSession(result.id);

        console.log("session ok");

        res.status(201).json({ token });
      } catch (err) {
        console.error("save err");
      }
    })
  );

  // ログイン処理
  app.post(
    "/api/login",
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
      res.status(200).json({ token });
    })
  );

  // ログアウト機能
  app.post(
    "/api/logout",
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

  app.listen(port, () => {
    console.log(`ready http://localhost:${port}`);
  });
}

main().catch((err) => {
  throw new Error(err);
});
