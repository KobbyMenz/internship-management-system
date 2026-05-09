/**
 * 📁 OPTIMIZED FILE DELETION SERVICE
 *
 * Safely and efficiently deletes image files from the static folder
 * ✅ Async/await for non-blocking operations
 * ✅ Error handling and logging
 * ✅ Batch deletion support for performance
 * ✅ Safe path validation to prevent directory traversal
 * ✅ File existence check before deletion
 * ✅ Retry logic for failed deletions
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ SECURITY: Define safe upload directory
// Note: From Services folder, go up 3 levels to root, then to public/uploads
const UPLOADS_DIR = path.join(__dirname, "../../../public/uploads");

/**
 * ✅ SECURITY: Validate and sanitize file path to prevent directory traversal
 * @param {string} filePath - The file path to validate
 * @returns {string|null} - Sanitized absolute path or null if invalid
 */
const validateFilePath = (filePath) => {
  console.log(`🔍 validateFilePath called with: ${filePath}`);
  
  if (!filePath || typeof filePath !== "string") {
    console.error("❌ Invalid filePath: not a string");
    return null;
  }

  // Extract filename from full path (e.g., "/uploads/1774634375095-334273859.JPG" -> "1774634375095-334273859.JPG")
  const filename = path.basename(filePath);
  console.log(`📄 Extracted filename: ${filename}`);

  // Prevent directory traversal attacks
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    console.warn(`⚠️ Invalid file path detected: ${filePath}`);
    return null;
  }

  // Construct safe absolute path
  const absolutePath = path.join(UPLOADS_DIR, filename);
  console.log(`📂 UPLOADS_DIR: ${UPLOADS_DIR}`);
  console.log(`📍 Absolute path: ${absolutePath}`);

  // Verify the resolved path is within the uploads directory
  if (!absolutePath.startsWith(UPLOADS_DIR)) {
    console.warn(`⚠️ Path traversal attempt blocked: ${filePath}`);
    return null;
  }

  console.log(`✅ Path validated successfully`);
  return absolutePath;
};

/**
 * ✅ Delete a single image file asynchronously
 * @param {string} filePath - Database file path (e.g., "/uploads/filename.jpg")
 * @param {number} maxRetries - Maximum retry attempts (default: 2)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteImageFile = async (filePath, maxRetries = 2) => {
  console.log(`\n🗑️ deleteImageFile called with: ${filePath}`);
  
  if (!filePath) {
    console.error("❌ No file path provided");
    return { success: false, message: "No file path provided" };
  }

  const validatedPath = validateFilePath(filePath);
  if (!validatedPath) {
    console.error(`❌ Path validation failed for: ${filePath}`);
    return { success: false, message: "Invalid file path" };
  }

  //console.log(`📋 Starting deletion with ${maxRetries} retries...`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // ✅ Check if file exists before attempting deletion
      const fileExists = await fileExistsAsync(validatedPath);
      //console.log(`🔎 File exists check (attempt ${attempt}): ${fileExists}`);
      
      if (!fileExists) {
        //console.log(`ℹ️ File already deleted or doesn't exist: ${filePath}`);
        return { success: true, message: "File not found (already deleted)" };
      }

      // ✅ Delete the file
      console.log(`🔨 Attempting to delete: ${validatedPath}`);
      await fs.unlink(validatedPath);
      //console.log(`✅ Image deleted successfully: ${filePath}`);
      return { success: true, message: "Image deleted successfully" };
    } catch (error) {
      console.error(
        `❌ Delete attempt ${attempt}/${maxRetries} failed:`,
        error.message,
      );

      // If this is the last attempt, return the error
      if (attempt === maxRetries) {
        console.error(`🛑 All ${maxRetries} deletion attempts failed`);
        return {
          success: false,
          message: `Failed to delete image after ${maxRetries} attempts: ${error.message}`,
        };
      }

      // Wait before retrying (exponential backoff: 50ms, 100ms, etc.)
      const waitTime = 50 * attempt;
      //console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return { success: false, message: "Unknown error during file deletion" };
};

/**
 * ✅ Delete multiple image files in parallel for better performance
 * @param {string[]} filePaths - Array of database file paths
 * @returns {Promise<{successful: number, failed: number, errors: object[]}>}
 */
export const deleteImageFilesBatch = async (filePaths) => {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    return { successful: 0, failed: 0, errors: [] };
  }

  //console.log(`🔄 Starting batch deletion of ${filePaths.length} files...`);

  // ✅ PERFORMANCE: Process deletions in parallel (concurrent)
  const results = await Promise.allSettled(
    filePaths.map((filePath) => deleteImageFile(filePath)),
  );

  // Analyze results
  let successful = 0;
  let failed = 0;
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (result.value.success) {
        successful++;
      } else {
        failed++;
        errors.push({
          filePath: filePaths[index],
          error: result.value.message,
        });
      }
    } else {
      failed++;
      errors.push({
        filePath: filePaths[index],
        error: result.reason?.message || "Unknown error",
      });
    }
  });

  // console.log(
  //   `📊 Batch deletion complete: ${successful} successful, ${failed} failed`,
  // );

  return { successful, failed, errors };
};

/**
 * ✅ Internal helper: Check if file exists asynchronously
 * @param {string} filePath - Absolute file path
 * @returns {Promise<boolean>}
 */
const fileExistsAsync = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * ✅ Clean up orphaned files: Delete files that aren't referenced in database
 * (Run periodically to free up disk space)
 * @param {string[]} referencedFiles - Array of files still in use from database
 * @returns {Promise<{deletedCount: number, errors: string[]}>}
 */
export const cleanupOrphanedFiles = async (referencedFiles = []) => {
  try {
    console.log("🧹 Starting orphaned file cleanup...");

    // Read all files in uploads directory
    const files = await fs.readdir(UPLOADS_DIR);
    const orphanedFiles = [];
    const errors = [];

    // Find orphaned files
    for (const file of files) {
      const filePath = `/uploads/${file}`;
      if (!referencedFiles.includes(filePath)) {
        orphanedFiles.push(filePath);
      }
    }

    if (orphanedFiles.length === 0) {
      //console.log("✅ No orphaned files found");
      return { deletedCount: 0, errors: [] };
    }

    //console.log(`Found ${orphanedFiles.length} orphaned files, deleting...`);

    // Delete orphaned files
    const results = await deleteImageFilesBatch(orphanedFiles);

    if (results.failed > 0) {
      results.errors.forEach((err) => {
        errors.push(`${err.filePath}: ${err.error}`);
      });
    }

    //console.log(`🧹 Cleanup complete: ${results.successful} files deleted`);
    return { deletedCount: results.successful, errors };
  } catch (error) {
    //console.error("❌ Error during orphaned file cleanup:", error);
    return { deletedCount: 0, errors: [error.message] };
  }
};

/**
 * ✅ Get file size for monitoring disk usage
 * @param {string} filePath - Database file path
 * @returns {Promise<number>} - File size in bytes
 */
export const getFileSize = async (filePath) => {
  try {
    const validatedPath = validateFilePath(filePath);
    if (!validatedPath) return 0;

    const fileExists = await fileExistsAsync(validatedPath);
    if (!fileExists) return 0;

    const stats = await fs.stat(validatedPath);
    return stats.size;
  } catch (error) {
    console.error("Error getting file size:", error);
    return 0;
  }
};

/**
 * ✅ Get total disk usage of uploads folder
 * @returns {Promise<{totalSize: number, fileCount: number}>}
 */
export const getUploadsFolderStats = async () => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    let totalSize = 0;

    // ✅ PERFORMANCE: Use Promise.allSettled for parallel stat checks
    const sizePromises = files.map((file) =>
      fs.stat(path.join(UPLOADS_DIR, file)).catch(() => null),
    );

    const stats = await Promise.allSettled(sizePromises);
    stats.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        totalSize += result.value.size;
      }
    });

    return {
      totalSize, // in bytes
      fileCount: files.length,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error("Error getting folder stats:", error);
    return { totalSize: 0, fileCount: 0, totalSizeMB: 0 };
  }
};

export default {
  deleteImageFile,
  deleteImageFilesBatch,
  cleanupOrphanedFiles,
  getFileSize,
  getUploadsFolderStats,
};
