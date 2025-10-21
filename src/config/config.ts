import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  DB_URL: process.env.MONGO_URI_STRING,
};

export const config = Object.freeze(_config);
