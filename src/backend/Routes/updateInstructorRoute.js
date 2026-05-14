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

    const sqlUpdate =
      routeName === "mentor"
        ? "UPDATE internship_db.mentor SET title = ?, name = ?, contact = ?, qualification = ?, status = ?, momoNumber = ? WHERE studentId = ? "
        : routeName === "head"
          ? "UPDATE internship_db.head SET title = ?, name = ?, contact = ?, qualification = ?, status = ?, momoNumber = ? WHERE studentId = ? "
          : "";

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
