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

    const sqlUpdate =
      "UPDATE internship_db.school SET schoolName = ?, schoolAddress = ?, town = ?, region = ?, district = ? WHERE studentId = ? ";
    db.query(
      sqlUpdate,
      [schoolName, schoolAddress, town, region, district, studentId],
      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).send("Error updating records"); //returning HTTP status
        }

        res.status(201).json({ message: "updated successfully" });
      },
    );
  });
}
