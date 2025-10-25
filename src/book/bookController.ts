import type { Response, Request, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises"; // use promises for async FS
import bookModel from "./bookModel.js";
import type { AuthRequest } from "../middlewares/authenticate.js";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  // console.log(req.files) // this help you to understand file structure
  const files = req.files as { [filename: string]: Express.Multer.File[] }; // this for typescript
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // ---------- Cover Image Upload ----------
  const cover = files.coverImage[0];
  const coverPath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    cover.filename
  );
  const coverImageExt = cover.mimetype.split("/").at(-1);
  const coverPublicId = cover.filename;

  let uploadCoverResult = null;
  try {
    uploadCoverResult = await cloudinary.uploader.upload(coverPath, {
      folder: "book-cover",
      public_id: coverPublicId,
      resource_type: "image",
      overwrite: true,
      use_filename: false,
      unique_filename: false,
      format: coverImageExt,
    });
  } catch (err) {
    console.error("Cover upload failed:", err);
  }

  try {
    await fs.unlink(coverPath);
  } catch (err) {
    console.warn("Failed to delete local cover file:", err);
  }

  // ---------- PDF/File Upload ----------
  const uploadedFile = files.file[0];
  const originalExtension = path.extname(uploadedFile.originalname); // e.g., ".pdf"
  const localFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    uploadedFile.filename
  );
  const finalFilePath = localFilePath + originalExtension;

  try {
    await fs.rename(localFilePath, finalFilePath);
  } catch (err) {
    console.error("Failed to rename PDF file:", err);
    return res.status(500).json({ message: "Failed to process PDF file" });
  }

  let uploadPDFResult = null;
  try {
    uploadPDFResult = await cloudinary.uploader.upload(finalFilePath, {
      folder: "book-pdfs",
      public_id: uploadedFile.filename,
      resource_type: "raw",
    });
  } catch (err) {
    console.error("PDF upload failed:", err);
  }

  try {
    await fs.unlink(finalFilePath);
  } catch (err) {
    console.warn("Failed to delete local PDF file:", err);
  }
  const _req = req as AuthRequest;
  //   console.log("userId ", _req.userId);

  // ----------Create Book--------
  const newBook = await bookModel.create({
    title,
    genre,
    author: _req.userId,
    coverImage: uploadCoverResult?.secure_url,
    file: uploadPDFResult?.secure_url,
  });

  // ---------- Return combined response ----------
  return res.status(201).json({
    message: "Upload results",
    data: {
      cover: uploadCoverResult
        ? {
            success: true,
            secure_url: uploadCoverResult.secure_url,
            publicId: coverPublicId,
          }
        : { success: false, error: "Failed to upload cover" },
      pdf: uploadPDFResult
        ? {
            success: true,
            secure_url: uploadPDFResult.secure_url,
            publicId: uploadedFile.filename,
          }
        : { success: false, error: "Failed to upload PDF" },
      newBookInfo: newBook
        ? {
            success: true,
            id: newBook._id,
          }
        : { success: false, error: "Failed to upload Book" },
    },
  });
};

// -------- single Book Get function ------------
const singleBookGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const _req = req as AuthRequest;
    const userId = req.params.userId;
    const book = await bookModel.findById({ _id: userId });
    //   console.log("Single Book Data",book);
    return res.status(201).json({
      message: "Single Book info ",
      bookInfo: book,
      bookId: book?._id,
    });
  } catch (error) {
    return next(createHttpError(500, "Book is not found "));
  }
};

const allBookGet = async (req: Request, res: Response, next: NextFunction) => {
  // TODO find() return all docs of DB ,so it is not recomended
  // used Pagination ( package -> mongoose pagination)
  try {
    const allBook = await bookModel.find();
    // console.log("all book info ", allBook);
    return res.status(202).json({
      messsage: " All book data",
      booksData: allBook,
    });
  } catch (error) {
    next(createHttpError(500, "Error while getting all books"));
  }
};
export { createBook, singleBookGet, allBookGet };
