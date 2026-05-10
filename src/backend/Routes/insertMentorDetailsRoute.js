import db from "../Services/dataBaseConnection.js";

export default function insertMentorDetailsRoute(app) {
  app.post("/api/insertMentorDetails/:studentId", (req, res) => {
    const studentId = req.params.studentId;
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

    const sqlInsert =
      "INSERT INTO internship_db.mentor (studentId, title, name, contact, qualification, status, momoNumber) VALUES (?,?,?,?,?,?,? )";
    db.query(
      sqlInsert,
      [studentId, title, name, contact, qualification, status, momoNumber],
      (err) => {
        if (err) {
          console.log("Database error", err);
          return res.status(500).json({
            error:
              "Records already submitted. Click on update button to make changes",
          }); //returning HTTP status
        }

        res.status(201).json({ message: "Records submited" });
      },
    );
  });
}
