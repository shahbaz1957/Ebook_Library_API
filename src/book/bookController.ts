import type { Response, Request, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises"; // use promises for async FS

const createBook = async (req: Request, res: Response, next: NextFunction) => {
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

  // ---------- Return combined response ----------
  return res.status(201).json({
    message: "Upload results",
    data: {
      cover: uploadCoverResult
        ? {
            success: true,
            url: uploadCoverResult.secure_url,
            publicId: coverPublicId,
          }
        : { success: false, error: "Failed to upload cover" },
      pdf: uploadPDFResult
        ? {
            success: true,
            url: uploadPDFResult.secure_url,
            publicId: uploadedFile.filename,
          }
        : { success: false, error: "Failed to upload PDF" },
    },
  });
};

export { createBook };
