import ROLES from "../../Services/ROLES.js";
import db from "../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";

export default function updateUserRoute(app) {
  app.put("/api/updateUser/:userId/:role", (req, res) => {
    const { userId, role } = req.params;
    // console.log("Request received Params: ", req.params);
    // console.log("Request received body: ", req.body);
    const { fullName, contact, email, programme, password } = req.body;

    // ✅ SECURITY: Input validation
    if (!userId || !fullName || !role || !contact || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Only require programme for students
    if (role === ROLES.USER && !programme) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check that the target record exists before attempting update
    const checkSql =
      role === ROLES.USER
        ? `SELECT 1 FROM internship_db.student WHERE studentId = ? LIMIT 1`
        : `SELECT 1 FROM internship_db.admin WHERE adminId = ? LIMIT 1`;

    db.query(checkSql, [userId], (checkErr, checkResults) => {
      if (checkErr) {
        console.log("Database error (check)", checkErr);
        return res.status(500).json({ error: "Error checking existing user" });
      }

      if (!checkResults || checkResults.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found. Please insert before updating." });
      }

      if (!password) {
        const sqlUpdate =
          role === ROLES.USER
            ? `UPDATE internship_db.student SET fullName = ?, contact = ?, email = ?, programme = ? WHERE studentId = ?`
            : `UPDATE internship_db.admin SET fullName = ?, contact = ?, email = ? WHERE adminId = ?`;
        db.query(
          sqlUpdate,
          role === ROLES.USER
            ? [fullName, contact, email, programme, userId]
            : [fullName, contact, email, userId],
          (err, results) => {
            if (err) {
              console.log("Database error", err);
              return res.status(500).send("This email can not be used!"); //returning HTTP status
            }

            if (results && results.affectedRows === 0) {
              return res
                .status(200)
                .json({ error: "No changes made to the user record." });
            }

            return res.status(200).json({ message: "Updated successfully" });
          },
        );
      } else {
        //Hashing the password before updating
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: err });
          }

          const sqlUpdate =
            role === ROLES.USER
              ? `UPDATE internship_db.student SET fullName = ?, contact = ?, email = ?, programme = ?, password = ? WHERE studentId = ?`
              : `UPDATE internship_db.admin SET fullName = ?, contact = ?, email = ?, password = ? WHERE adminId = ?`;
          db.query(
            sqlUpdate,
            role === ROLES.USER
              ? [fullName, contact, email, programme, hashedPassword, userId]
              : [fullName, contact, email, hashedPassword, userId],
            (err, results) => {
              if (err) {
                console.log("Database error", err);
                return res
                  .status(500)
                  .json({ error: "This email can not be used!" }); //returning HTTP status
              }

              if (results && results.affectedRows === 0) {
                return res
                  .status(200)
                  .json({ error: "No changes made to the user record." });
              }

              return res.status(200).json({ message: "Saved successfully" });
            },
          );
        });
      }
    });
  });
}
