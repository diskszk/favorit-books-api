import "reflect-metadata";
import express from "express";
// import helmet from "helmet";
import cors from "cors";
// import { authMiddleware } from "./middleware";
import { authRouter, notesRouter, helloRouter, usersRouter } from "./routes";
import { createConnection } from "typeorm";

const main = async () => {
  const app = express();
  const port = process.env.SERVER_PORT;

  const frontendServer = process.env.FRONTEND_SERVER || "";

  // frontからAPIを叩けない
  // app.use(helmet);
  // 指定するサーバーからのリクエストのみにレスポンスを返す。
  app.use(
    cors({
      origin: frontendServer,
    })
  );

  app.use(express.json());

  try {
    await createConnection();
  } catch (err) {
    throw new Error("DBとの接続に失敗しました。" + err);
  }

  try {
    // app.use(authMiddleware);
  } catch (err) {
    throw new Error("セッションに失敗しました。" + err);
  }

  app.use(usersRouter);
  app.use(authRouter);
  app.use(notesRouter);
  app.use(helloRouter);

  app.listen(port, () => {
    console.log(`ready http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1); // nodemonでサーバー立ててるとプロセスは続いてしまう
});
