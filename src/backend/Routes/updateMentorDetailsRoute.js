import db from "../Services/dataBaseConnection.js";

export default function updateMentorDetails(app) {
  app.put("/api/updateMentorDetails/:studentId", (req, res) => {
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

    const sqlUpdate =
      "UPDATE internship_db.mentor SET title = ?, name = ?, contact = ?, qualification = ?, status = ?, momoNumber = ? WHERE studentId = ? ";
    db.query(
      sqlUpdate,
      [title, name, contact, qualification, status, momoNumber, studentId],
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
