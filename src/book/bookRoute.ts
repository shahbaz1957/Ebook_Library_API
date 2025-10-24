import express from "express";
import { createBook } from "./bookController.js";
import uploadBookAssets from "../middlewares/multer.js";
import authenticate from "../middlewares/authenticate.js";

const bookRouter = express.Router();

bookRouter.post("/", authenticate, uploadBookAssets, createBook);
export default bookRouter;
