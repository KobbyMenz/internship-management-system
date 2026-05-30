import CapitalizeWords from "../../Functions/CapitalizeWords.js";
import db from "../Services/dataBaseConnection.js";

export default function insertInstructorRoute(app) {
  app.post("/api/insertInstructor/:studentId/:routeName", (req, res) => {
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

    const sqlInsert =
      routeName === "mentor"
        ? `INSERT INTO internship_db.mentor (studentId, title, name, contact, qualification, status, momoNumber) VALUES (?,?,?,?,?,?,? )`
        : routeName === "head"
          ? `INSERT INTO internship_db.head (studentId, title, name, contact, qualification, status, momoNumber) VALUES (?,?,?,?,?,?,? )`
          : "";
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

        res.status(201).json({
          message: `${CapitalizeWords(routeName)} details submitted successfully`,
        });
      },
    );
  });
}
