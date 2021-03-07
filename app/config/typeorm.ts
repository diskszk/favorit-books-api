import { createConnection, ConnectionOptions } from "typeorm";
import { NoteEntity, UserEntity, SessionEntity } from "../entities";
import dotenv from "dotenv";
dotenv.config();

export const initializeTypeOrm = async () => {
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
};
