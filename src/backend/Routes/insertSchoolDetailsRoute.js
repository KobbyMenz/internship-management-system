import db from "../Services/dataBaseConnection.js";

export default function insertSchoolDetailsRoute(app) {
  app.post("/api/insertShoolDetails/:studentId", (req, res) => {
    const studentId = req.params.studentId;
    //console.log("Request received: ", req.body);
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

    const sqlInsert =
      "INSERT INTO internship_db.school (studentId, schoolName, schoolAddress, town, region, district) VALUES (?,?,?,?,?,? )";
    db.query(
      sqlInsert,
      [studentId, schoolName, schoolAddress, town, region, district],
      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({
            error:
              "Records already submitted. Click on update button to make changes",
          }); //returning HTTP status
        }

        res
          .status(201)
          .json({ message: "School details submitted successfully" });
      },
    );
  });
}
