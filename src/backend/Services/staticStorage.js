import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
const app = express();

const staticStorage = () => {
  //Static folder to serve uploaded image
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(
    "../../public/uploads",
    express.static(path.join(__dirname, "../../public/uploads"))
  );
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  //Setting up multer to store uploaded files in the upload directory
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../../public/uploads"); //upload folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);
      cb(null, uniqueSuffix); //Adding timestamps to the filename
    },
  });

  return multer({ storage });
};
export default staticStorage;
