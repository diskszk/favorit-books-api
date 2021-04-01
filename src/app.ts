import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { helloRouter, usersRouter } from './routes';
// import { createConnection, getConnectionOptions } from 'typeorm';

const main = async () => {
  const app = express();
  const port = process.env.PORT || 8000;

  app.use(helmet());
  // 指定するサーバーからのリクエストのみにレスポンスを返す。
  app.use(
    cors({
      origin: '*',
    })
  );

  app.use(express.json());

  try {
    // const connectionOptions = await getConnectionOptions();
    // await createConnection(connectionOptions);
  } catch (err) {
    throw new Error('DBとの接続に失敗しました。' + err);
  }

  app.use(usersRouter);
  app.use(helloRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'hello world' });
  });

  app.listen(port, () => {
    console.log(`ready http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
