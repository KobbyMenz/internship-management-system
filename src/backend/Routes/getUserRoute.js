import ROLES from "../../Services/ROLES.js";
import db from "../Services/dataBaseConnection.js";

export default function getUserRoute(app) {
  app.get("/api/getUser/:userId/:role", (req, res) => {
    const { userId, role } = req.params;
    // console.log("Request received Params: ", req.params);
    // console.log("Request received body: ", req.body);

    // ✅ SECURITY: Input validation
    if (!userId || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery =
      role === ROLES.USER
        ? `SELECT student.studentId, student.fullName, student.contact, student.email, student.programme, school.schoolName, school.district 
      FROM internship_db.student 
      LEFT JOIN  internship_db.school ON student.studentId = school.studentId 
      WHERE student.studentId = ?`
        : `SELECT admin.adminId, admin.fullName, admin.contact, admin.email
        FROM internship_db.admin 
        WHERE admin.adminId = ?`;

    db.query(sqlQuery, [userId], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        userId: role === ROLES.USER ? result[0].studentId : result[0].adminId,
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
