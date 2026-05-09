import db from "../Services/dataBaseConnection.js";

export default function getMentorDetailsRoute(app) {
  app.get("/api/getMentorDetails/:indexNumber", (req, res) => {
    const indexNumber = req.params.indexNumber;
    const sqlQuery =
      "SELECT * FROM internship_db.mentor WHERE mentor.studentId = ?";

    db.query(sqlQuery, [indexNumber], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        studentId: result[0].studentId,
        title: result[0].title,
        name: result[0].name,
        contact: result[0].contact,
        qualification: result[0].qualification,
        status: result[0].status,
        momoNumber: result[0].momoNumber,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });
}
