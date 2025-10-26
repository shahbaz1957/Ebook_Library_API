import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";
import dbConnection from "../src/config/db.js";

// Keep track of DB connection across invocations
let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    try {
      await dbConnection();
      isConnected = true;
    } catch (err) {
      console.error("DB Connection failed:", err);
      return res.status(500).send("Database connection failed");
    }
  }

  app(req, res); // forward the request to Express app
}
