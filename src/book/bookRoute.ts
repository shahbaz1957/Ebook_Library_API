import express from "express";
import { allBookGet, createBook, singleBookGet } from "./bookController.js";
import uploadBookAssets from "../middlewares/multer.js";
import authenticate from "../middlewares/authenticate.js";

const bookRouter = express.Router();

bookRouter.post("/", authenticate, uploadBookAssets, createBook);
bookRouter.get("/:bookId", authenticate,singleBookGet)
bookRouter.get("/", allBookGet)

export default bookRouter;
