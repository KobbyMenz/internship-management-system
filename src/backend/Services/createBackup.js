import fs from "fs";
import path from "path";
import process from "process";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
dotenv.config(); // Loading environment variables

// Compute backup directory relative to this file (src/backend/db_backups)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupDir = path.join(__dirname, "..", "db_backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const createBackup = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(backupDir, `backup.sql`);
    const host = process.env.VITE_DB_HOST;
    const user = process.env.VITE_DB_USER;
    const password = process.env.VITE_DB_PASSWORD;
    const databaseName = process.env.VITE_DB_NAME;

    const dumpCommand = `mysqldump --host=${host} --user=${user} --password=${password} ${databaseName}`;
    const dumpProcess = spawn(dumpCommand, { shell: true });

    const writeStream = fs.createWriteStream(filePath);
    dumpProcess.stdout.pipe(writeStream);
    dumpProcess.on("error", (err) => {
      reject(`Backup process error: ${err.message}`);
    });

    dumpProcess.on("close", (code) => {
      if (code === 0) {
        resolve(
          `Backup created successfully. \nFile path: ${filePath}`
        );
        return "Backup created successfully";
      } else {
        reject(`Backup process failed with code: ${code}`);
        return `Backup process failed`;
      }
    });
  });
};

export default createBackup;
