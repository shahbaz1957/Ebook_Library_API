import app from "./src/app.js";
import { config } from "./src/config/config.js";
import dbConnection from "./src/config/db.js";

const startServer = async () => {
  //db connection
  await dbConnection();

  const PORT = config.port || 5050;

  app.listen(PORT, () => {
    console.log(`Server running on port..${PORT}`);
  });
};


 startServer();