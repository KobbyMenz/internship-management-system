import db from "../Services/dataBaseConnection.js";
import ROLES from "../../Services/ROLES.js";

export default function getAllUsersRoute(app) {
  app.get("/api/getAllUsers/:role", (req, res) => {
    const { role } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    if (!role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Validate role before querying
    if (role !== ROLES.USER && role !== ROLES.ADMIN) {
      return res.status(403).json({ error: "Invalid role" });
    }

    const sqlQuery =
      role === ROLES.USER
        ? `SELECT 
            student.studentId AS id, 
            student.fullName, 
            student.contact, 
            student.gender, 
            student.email, 
            student.programme, 
            school.schoolName, 
            school.district 
           FROM internship_db.student 
           LEFT JOIN internship_db.school ON student.studentId = school.studentId
           LIMIT ? OFFSET ?` // ✅ added
        : role === ROLES.ADMIN
          ? `SELECT 
            admin.adminId AS id, 
            admin.fullName, 
            admin.contact, 
            admin.email, 
            admin.status AS userStatus
           FROM internship_db.admin
           LIMIT ? OFFSET ?`
          : ""; // ✅ added

    // ✅ Pass limit and offset as parameters
    db.query(sqlQuery, [limit, offset], (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.status(200).json({ result, page, limit });
    });
  });
}
