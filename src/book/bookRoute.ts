import express from "express";
import {
    allBookGet,
    createBook,
    deleteBook,
    singleBookGet,
    updateBook,
} from "./bookController.js";
import uploadBookAssets from "../middlewares/multer.js";
import authenticate from "../middlewares/authenticate.js";

const bookRouter = express.Router();

bookRouter.post("/", authenticate, uploadBookAssets, createBook);
bookRouter.get("/:bookId", singleBookGet);
bookRouter.get("/", allBookGet);
bookRouter.delete("/:bookId", authenticate, deleteBook);
bookRouter.patch("/:bookId", authenticate, uploadBookAssets, updateBook);

export default bookRouter;
