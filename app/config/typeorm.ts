import { createConnection } from "typeorm";
import { NoteEntity, UserEntity, SessionEntity } from "../entities";
import dotenv from "dotenv";
dotenv.config();

// 環境変数に型を付けて呼び出す方法を試みたがDBによって必要なプロパティが異なっているのでひとまずはハードコードする

// const databaseType = process.env.DB_TYPE;
const databaseType = "mysql";

export const initializeTypeOrm = async () => {
  await createConnection({
    synchronize: true,
    type: databaseType,
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    entities: [NoteEntity, UserEntity, SessionEntity],
  });
};
