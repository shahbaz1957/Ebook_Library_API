import express from "express";
import {
    allBookGet,
    createBook,
    deleteBook,
    singleBookGet,
} from "./bookController.js";
import uploadBookAssets from "../middlewares/multer.js";
import authenticate from "../middlewares/authenticate.js";

const bookRouter = express.Router();

bookRouter.post("/", authenticate, uploadBookAssets, createBook);
bookRouter.get("/:bookId", authenticate, singleBookGet);
bookRouter.get("/", allBookGet);
bookRouter.delete("/:bookId", authenticate, deleteBook);
export default bookRouter;
