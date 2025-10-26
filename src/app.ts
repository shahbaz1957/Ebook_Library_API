import createHttpError from "http-errors";
import express from "express";
import cors from "cors";
import globalError from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRoute.js";
import bookRouter from "./book/bookRoute.js";
import type { Request, Response, NextFunction } from "express";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    })
);

// Here we Register All routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    const error = createHttpError(400, () => {
        return next(error);
    });
    res.json({ message: "Ebook Library API is running!" });
});

app.post("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Data Save Successfully !!!!! ");
});
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error

app.use(globalError);

export default app;

// # MONGO_URI_STRING=mongodb://localhost:27017/ebook_library