import path from "node:path";
import multer from "multer";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

// __dirname is not in ECMA-16 then we do this
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// here we create path
const uploadPath = path.resolve(__dirname, "../../public/data/uploads");
fs.mkdirSync(uploadPath, { recursive: true });

// here we define destination and limits of file
const fileUploader = multer({
  dest: uploadPath,
  limits: { fileSize: 1.048576e7 },
});
//  uploadBookAssets upload coverImage and file in local path
const uploadBookAssets = fileUploader.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

export default uploadBookAssets;
