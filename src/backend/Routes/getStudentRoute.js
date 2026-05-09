import db from "../Services/dataBaseConnection.js";

export default function getStudentRoute(app) {
  app.get("/api/getStudent/:indexNumber", (req, res) => {
    const indexNumber = req.params.indexNumber;
    const sqlQuery =
      "SELECT student.studentId, student.fullName, student.contact, student.email, student.programme, school.schoolName, school.district FROM internship_db.student LEFT JOIN  internship_db.school ON student.studentId = school.studentId WHERE student.studentId = ?";

    db.query(sqlQuery, [indexNumber], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        studentId: result[0].studentId,
        fullName: result[0].fullName,
        contact: result[0].contact,
        email: result[0].email,
        programme: result[0].programme,
        schoolName: result[0].schoolName,
        district: result[0].district,
      }); //Sending the query result back to json.
       //console.log(result);
    });
  });
}
