import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  DB_URL: process.env.MONGO_URI_STRING,
  ENV: process.env.NODE_ENV,
  Jwt_Secret: process.env.JWT_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
