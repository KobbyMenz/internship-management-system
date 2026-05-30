import db from "../Services/dataBaseConnection.js";

export default function updateSchoolDetailsRoute(app) {
  app.put("/api/updateSchoolDetails/:studentId", (req, res) => {
    const studentId = req.params.studentId;
    // console.log("Request received update: ", req.body);
    const { schoolName, schoolAddress, town, region, district } = req.body;

    // ✅ SECURITY: Input validation
    if (
      !studentId ||
      !schoolName ||
      !schoolAddress ||
      !town ||
      !region ||
      !district
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // First check if a school record exists for this studentId
    // const sqlCheck =
    //   "SELECT 1 FROM internship_db.school WHERE studentId = ? LIMIT 1";
    // db.query(sqlCheck, [studentId], (checkErr, checkResults) => {
    //   if (checkErr) {
    //     console.log("Database error (check)", checkErr);
    //     return res
    //       .status(500)
    //       .json({ error: "Error checking existing records" });
    //   }

    //   if (!checkResults || checkResults.length === 0) {
    //     // No existing record found — inform frontend to insert first
    //     return res
    //       .status(404)
    //       .json({
    //         error: "No school details found. Please add before updating.",
    //       });
    //   }

    const sqlUpdate =
      "UPDATE internship_db.school SET schoolName = ?, schoolAddress = ?, town = ?, region = ?, district = ? WHERE studentId = ?";
    db.query(
      sqlUpdate,
      [schoolName, schoolAddress, town, region, district, studentId],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.log("Database error (update)", updateErr);
          return res.status(500).json({ error: "Error updating records" });
        }

        // If no rows were affected, the update did not change anything (or studentId didn't match)
        if (updateResults && updateResults.affectedRows === 0) {
          return res
            .status(200)
            .json({ message: "No changes made to the record." });
        }

        return res
          .status(200)
          .json({ message: "School details updated successfully" });
      },
    );
    // });
  });
}
