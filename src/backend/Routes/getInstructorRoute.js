import db from "../Services/dataBaseConnection.js";

export default function getInstructorRoute(app) {
  app.get("/api/getInstructor/:studentId/:routeName", (req, res) => {
    const { studentId, routeName } = req.params;

    // ✅ SECURITY: Input validation
    if (!studentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery =
      routeName === "mentor"
        ? "SELECT * FROM internship_db.mentor WHERE mentor.studentId = ?"
        : routeName === "head"
          ? "SELECT * FROM internship_db.head WHERE head.studentId = ?"
          : "";

    db.query(sqlQuery, [studentId], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        studentId: result[0] ? result[0].studentId : "",
        title: result[0] ? result[0].title : "",
        name: result[0] ? result[0].name : "",
        contact: result[0] ? result[0].contact : "",
        qualification: result[0] ? result[0].qualification : "",
        status: result[0] ? result[0].status : "",
        momoNumber: result[0] ? result[0].momoNumber : "",
      }); //Sending the query result back to json.
      //console.log(result);
    });
  });
}
