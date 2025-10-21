import createHttpError from "http-errors";
import express from "express";
import globalError from "./middlewares/globalErrorHandler.js";

const app = express();

// Middleware
app.use(express.json());

// route
app.get("/", (req, res, next) => {
  const error = createHttpError(400, () => {
    throw error;
  });
  res.json({ message: "Ebook Library API is running!" });
});
app.post("/", (req, res, next) => {
  res.send("Data Save Successfully !!!!! ");
});

// Global error

app.use(globalError);

export default app;
