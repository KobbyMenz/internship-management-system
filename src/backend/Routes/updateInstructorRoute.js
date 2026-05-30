import CapitalizeWords from "../../Functions/CapitalizeWords.js";
import db from "../Services/dataBaseConnection.js";

export default function updateInstructorRoute(app) {
  app.put("/api/updateInstructor/:studentId/:routeName", (req, res) => {
    const { studentId, routeName } = req.params;
    // console.log("Request received: ", req.body);
    const { title, name, contact, qualification, status, momoNumber } =
      req.body;

    // ✅ SECURITY: Input validation
    if (
      !studentId ||
      !title ||
      !name ||
      !contact ||
      !qualification ||
      !status ||
      !momoNumber
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const table =
      routeName === "mentor" ? "mentor" : routeName === "head" ? "head" : "";
    if (!table) return res.status(400).json({ error: "Invalid routeName" });

    const sqlCheck = `SELECT 1 FROM internship_db.${table} WHERE studentId = ? LIMIT 1`;
    db.query(sqlCheck, [studentId], (checkErr, checkResults) => {
      if (checkErr) {
        console.log("Database error (check)", checkErr);
        return res
          .status(500)
          .json({ error: "Error checking existing instructor record" });
      }

      if (!checkResults || checkResults.length === 0) {
        return res.status(404).json({
          error: "records not found. Please add before updating.",
        });
      }

      const sqlUpdate = `UPDATE internship_db.${table} SET title = ?, name = ?, contact = ?, qualification = ?, status = ?, momoNumber = ? WHERE studentId = ?`;
      db.query(
        sqlUpdate,
        [title, name, contact, qualification, status, momoNumber, studentId],
        (err, results) => {
          if (err) {
            console.log("Database error", err);
            return res.status(500).send("Error updating records"); //returning HTTP status
          }

          if (results && results.affectedRows === 0) {
            return res
              .status(200)
              .json({ message: "No changes made to the instructor record." });
          }

          return res.status(200).json({
            message: `${CapitalizeWords(routeName)} details updated successfully`,
          });
        },
      );
    });
  });
}
