import mongoose from "mongoose";
import { config } from "./config.js";

let isConnected = false; // track connection

const dbConnection = async () => {
  if (isConnected) {
    console.log("✅👌 Db is already connected!");
    return;
  }

  try {
    mongoose.connection.once("connected", () => {
      isConnected = true;
      console.log("✅👌 Db Connected Successfully!");
    });

    mongoose.connection.once("error", (err) => {
      console.error("❌ Error in Db Connection:", err);
    });

    await mongoose.connect(config.DB_URL as string);
  } catch (error) {
    console.error("❌ Db Connection failed:", error);
    throw error; // let caller handle the error
  }
};

export default dbConnection;
