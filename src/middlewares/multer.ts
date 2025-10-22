import path from "node:path";
import multer from "multer";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.resolve(__dirname, "../../public/data/uploads");
fs.mkdirSync(uploadPath, { recursive: true });

const fileUploader = multer({
  dest: uploadPath,
  limits: { fileSize: 1.048576e7 },
});


const uploadBookAssets = fileUploader.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

export default uploadBookAssets;
