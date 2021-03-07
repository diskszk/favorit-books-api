import "reflect-metadata";
import express from "express";
import { initializeTypeOrm } from "./config";
import { authMiddleware } from "./middleware";
import { authRouter, notesRouter, helloRouter } from "./routes";

const main = async () => {
  const app = express();
  const port = process.env.SERVER_PORT;

  try {
    await initializeTypeOrm();
  } catch (err) {
    console.error("err");
    throw new Error("DBとの接続に失敗しました。" + err);
  }

  app.use(express.json());
  try {
    app.use(authMiddleware);
  } catch (err) {
    throw new Error("セッションに失敗しました。" + err);
  }

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
