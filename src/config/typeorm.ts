import { createConnection } from "typeorm";
import { NoteEntity, UserEntity, SessionEntity } from "../entities";
import dotenv from "dotenv";
dotenv.config();

const databaseType = "mysql";

export const getConnection = async () => {
  await createConnection({
    synchronize: true,
    type: databaseType,
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT,
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    entities: [NoteEntity, UserEntity, SessionEntity],

    logging: true,
    cli: {
      entitiesDir: "app/entities",
      migrationsDir: "app/migration",
    },
  });
};
