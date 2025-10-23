import express from 'express';
import { createBook } from './bookController.js';
import uploadBookAssets from '../middlewares/multer.js';


const bookRouter = express.Router();

bookRouter.post("/", uploadBookAssets,createBook)

export default bookRouter