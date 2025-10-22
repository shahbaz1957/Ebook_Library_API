import createHttpError from "http-errors";
import express from "express";
import globalError from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRoute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.get("/", (req, res, next) => {
  const error = createHttpError(400, () => {
    return next(error);
  });
  res.json({ message: "Ebook Library API is running!" });
});

app.post("/", (req, res, next) => {
  res.send("Data Save Successfully !!!!! ");
});
app.use("/api/users", userRouter);

// Global error

app.use(globalError);

export default app;
