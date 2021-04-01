/* eslint-disable node/no-unpublished-require */
const dotenv = require('dotenv'); // 環境変数を使う
dotenv.config();

module.exports = {
  synchronize: false,
  type: 'mysql',
  host: process.env.DB_HOST || '',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  entities:
    process.env.NODE_ENV === 'production'
      ? ['dist/entity/**/*.js']
      : ['src/entity/**/*.ts', 'dist/entity/**/*.js'],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/migration/**/*.js']
      : ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  logging: false,
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
