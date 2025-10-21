import mongoose from "mongoose";
import { config } from "./config.js";

const dbConnection = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(" ✅👌 Db Connect Successfully !!! ");
    });

    mongoose.connection.on('error', (err)=>{
        console.log(" ❌ Error in Db Connection ?????? ")
    })
    await mongoose.connect(config.DB_URL as string);

  } catch (error) {
    console.log(" ❌ Db Connection failed ???? ");
    process.exit(1);
  }
};

export default dbConnection;



