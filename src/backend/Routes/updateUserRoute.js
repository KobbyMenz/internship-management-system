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
        (err) => {
          if (err) {
            console.log("Database error", err);
            return res.status(500).send("This email can not be used!"); //returning HTTP status
          }

          res.status(201).json({ message: "updated successfully" });
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
          (err) => {
            if (err) {
              console.log("Database error", err);
              return res
                .status(500)
                .json({ error: "This email can not be used!" }); //returning HTTP status
            }

            res.status(201).json({ message: "Saved successfully" });
            //console.log(result);
          },
        );
      });
    }
  });
}
