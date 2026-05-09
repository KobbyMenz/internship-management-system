/**
 * 📁 FILE MANAGEMENT ROUTES
 *
 * Routes for managing files and disk space
 * ✅ Get upload folder statistics
 * ✅ Cleanup orphaned files
 * ✅ Monitor disk usage
 */

import db from "../Services/dataBaseConnection.js";
import {
  getUploadsFolderStats,
  cleanupOrphanedFiles,
  deleteImageFile,
} from "../Services/fileDeleteService.js";

const fileManagementRoute = (app) => {
  /**
   * GET /api/uploads/stats - Get folder statistics
   * Returns: { totalSize, fileCount, totalSizeMB }
   */
  app.get("/api/uploads/stats", async (req, res) => {
    try {
      const stats = await getUploadsFolderStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting folder stats:", error);
      res.status(500).json({ error: "Unable to get folder statistics" });
    }
  });

  /**
   * POST /api/uploads/cleanup - Delete orphaned files
   * Identifies files not referenced in the database and deletes them
   * Returns: { deletedCount, errors }
   */
  app.post("/api/uploads/cleanup", async (req, res) => {
    try {
      console.log("🧹 Starting cleanup process...");

      // ✅ Get all referenced files from database
      const sqlAdmin =
        "SELECT photo FROM e_voting_db.admin WHERE photo IS NOT NULL";
      const sqlCandidate =
        "SELECT photo FROM e_voting_db.candidate WHERE photo IS NOT NULL";
      const sqlVoter =
        "SELECT photo FROM e_voting_db.voter WHERE photo IS NOT NULL";

      let referencedFiles = [];

      // Fetch files from all tables
      const [adminPhotos, candidatePhotos, voterPhotos] = await Promise.all([
        new Promise((resolve) => {
          db.query(sqlAdmin, (err, results) => {
            resolve(err ? [] : results.map((r) => r.photo));
          });
        }),
        new Promise((resolve) => {
          db.query(sqlCandidate, (err, results) => {
            resolve(err ? [] : results.map((r) => r.photo));
          });
        }),
        new Promise((resolve) => {
          db.query(sqlVoter, (err, results) => {
            resolve(err ? [] : results.map((r) => r.photo));
          });
        }),
      ]);

      referencedFiles = [...adminPhotos, ...candidatePhotos, ...voterPhotos];

      console.log(
        `📊 Found ${referencedFiles.length} referenced files in database`,
      );

      // ✅ Cleanup orphaned files
      const result = await cleanupOrphanedFiles(referencedFiles);

      res.status(200).json({
        success: true,
        message: `Cleanup complete: ${result.deletedCount} orphaned files deleted`,
        deletedCount: result.deletedCount,
        errors: result.errors,
      });
    } catch (error) {
      console.error("Error during cleanup:", error);
      res.status(500).json({ error: "Cleanup operation failed" });
    }
  });

  /**
   * DELETE /api/uploads/:filename - Manually delete a specific file
   * For admin use only
   */
  app.delete("/api/uploads/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;

      // ✅ Validate filename to prevent directory traversal
      if (!filename || filename.includes("..") || filename.includes("/")) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const filePath = `/uploads/${filename}`;
      const result = await deleteImageFile(filePath);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: "File deleted successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Unable to delete file" });
    }
  });
};

export default fileManagementRoute;
