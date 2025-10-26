import mongoose from "mongoose";
import { config } from "./config.js";

let isConnected = false; // track connection status

const dbConnection = async () => {
  if (isConnected) {
    console.log("✅👌 Db is already connected!");
    return;
  }

  try {
    // Listen only once for connection events
    mongoose.connection.once("connected", () => {
      isConnected = true;
      console.log("✅👌 Db Connect Successfully !!!");
    });

    mongoose.connection.once("error", (err) => {
      console.error("❌ Error in Db Connection:", err);
    });

    await mongoose.connect(config.DB_URL as string);

  } catch (error) {
    console.error("❌ Db Connection failed:", error);
    process.exit(1);
  }
};

export default dbConnection;
