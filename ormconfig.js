/* eslint-disable node/no-unpublished-require */
const dotenv = require("dotenv"); // 環境変数を使う
dotenv.config();

module.exports = {
  synchronize: false,
  type: "mysql",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT,
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  logging: false,
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migration",
  },
};
