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
        const bookId = req.params.bookId;
        const book = await bookModel.findById({ _id: bookId });
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
// get list of book
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
// delete book
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const book = await bookModel.findById({ _id: bookId });

    if (!book) {
        return next(createHttpError(404, "Book not found"));
    }

    // // check user can delete
    // console.log(book);
    const _req = req as AuthRequest;
    if (book?.author.toString() !== _req.userId) {
        return next(createHttpError(403, "User not authorized to delete book"));
    }

    const coverImageSplite = book?.coverImage.split("/");
    const coverImagePublicId =
        coverImageSplite?.at(-2) +
        "/" +
        coverImageSplite?.at(-1)?.split(".").at(-2);
    const fileSpilte = book?.file.split("/");
    const filePublicId = fileSpilte?.at(-2) + "/" + fileSpilte?.at(-1);
    // const filePublicId =fileSpilte.at(-2) + "/" + fileSpilte.at(-1)?.split(".").at(0);

    // console.log(filePublicId);
    // console.log(coverImagePublicId);

    // delete cover & file from cloudinary
    try {
        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(filePublicId, {
            resource_type: "raw",
        });
    } catch (error) {
        return next(
            createHttpError(
                500,
                "Error while delete cover & file from cloudinary"
            )
        );
    }

    // delete cover and file url from DB
    try {
        await bookModel.deleteOne({ _id: bookId });
        return res.status(200).json({
            message: "data delete",
        });
    } catch (error) {
        return next(
            createHttpError(500, "Error while delete cover & file from DB ")
        );
    }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body || {};

    if (!title || !genre) {
        return next(createHttpError(400, "Missing title or genre"));
    }
    // Approach
    // 1. check user can update
    const bookId = req.params.bookId;
    const book = await bookModel.findById({ _id: bookId });
    // console.log("Book for update", book);
    if (!book) {
        next(createHttpError(404, "For update book is not found"));
    }
    // check user can delete
    const _req = req as AuthRequest;
    if (book?.author.toString() !== _req.userId) {
        return next(createHttpError(403, "User not authorized to update book"));
    }
    // if Book exist then update on cloudinary first and then DB

    let completeCoverImage;
    const files = req.files as { [filename: string]: Express.Multer.File[] }; // this for typescript
    if (files.coverImage) {
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
        completeCoverImage = uploadCoverResult?.secure_url;

        try {
            await fs.unlink(coverPath);
        } catch (err) {
            console.warn("Failed to delete local cover file:", err);
        }
    }

    let completefile;
    if (files.file) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
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
            return res
                .status(500)
                .json({ message: "Failed to process PDF file" });
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
        completefile = uploadPDFResult?.secure_url;

        try {
            await fs.unlink(finalFilePath);
        } catch (err) {
            console.warn("Failed to delete local PDF file:", err);
        }
    }

    // now delete file and cover image form DB
    const updateBookInDb = await bookModel.findByIdAndUpdate(
        {_id:bookId},
        {
            title,
            genre,
            coverImage: completeCoverImage || book.coverImage,
            file: completefile || book.file,
        },
        { new: true }
    );
    // console.log(updateBookInDb);
    if (!updateBookInDb) {
        return next(createHttpError(404, "Book not found while updating"));
    }
    return res.status(201).json({
        message: "Book updated successfully",
        data: {
            _id: updateBookInDb._id,
            title: updateBookInDb.title,
            genre: updateBookInDb.genre,
            coverImage: updateBookInDb.coverImage,
            file: updateBookInDb.file,
        },
    });
};

export { createBook, singleBookGet, allBookGet, deleteBook, updateBook };
