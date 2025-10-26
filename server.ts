import app from "./src/app.js";
import { config } from "./src/config/config.js";
import dbConnection from "./src/config/db.js";


  //db connection

  await dbConnection();

  // const PORT = config.port || 5050;

  
export default app
