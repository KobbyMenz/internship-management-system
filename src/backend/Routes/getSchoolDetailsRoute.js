import db from "../Services/dataBaseConnection.js";

export default function getSchoolDetailsRoute(app) {
  app.get("/api/getSchoolDetails/:indexNumber", (req, res) => {
    const indexNumber = req.params.indexNumber;
    const sqlQuery =
      "SELECT * FROM internship_db.school WHERE school.studentId = ?";

    // const sqlQuery = "SELECT * FROM internship_db.student";

    db.query(sqlQuery, [indexNumber], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      //   const data = result[0];

      //   if (data === null || data === undefined) {
      //     res.status(200).json({
      //       indexNumber: "",
      //       schoolName: "",
      //       schoolAddress: "",
      //       region: "",
      //       district: "",
      //     }); //Sending the query result back to json.
      //     return;
      //   }

      res.status(200).json({
        studentId: result[0].studentId,
        schoolName: result[0].schoolName,
        schoolAddress: result[0].schoolAddress,
        town: result[0].town,
        region: result[0].region,
        district: result[0].district,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });
}
