import type { Response, Request, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [filename: string]: Express.Multer.File[] };
    console.log(req.files)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const cover = files.coverImage[0];
  const coverPath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    cover.filename
  );

  const coverImageExt = files.coverImage[0].mimetype.split("/").at(-1);
  const coverPublicId = files.coverImage[0].filename;

  const uploadFilesOnCLoudinary = await cloudinary.uploader.upload(coverPath, {
    folder: "book-cover",
    public_id: coverPublicId, // filepath
    resource_type: "image",
    overwrite: true,
    use_filename: false,
    unique_filename: false,
    format: coverImageExt,
  });
  return res.status(201).json({coverPublicId:coverPublicId, message: "Uploaded", data: uploadFilesOnCLoudinary });
//   console.log("Upload on Cloudonary -> ", uploadFilesOnCLoudinary);
//   console.log("coverPublicId .. -> ", coverPublicId);
};

export { createBook };
