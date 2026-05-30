import db from "../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";

export default function insertUserRoute(app) {
  app.post("/api/insertUser/", (req, res) => {
    //const studentId = req.params.studentId;
    //console.log("Request received: ", req.body);
    const {
      userId,
      fullName,
      gender,
      contact,
      email,
      programme,
      password,
      // photo,
    } = req.body;

    // ✅ SECURITY: Input validation
    if (
      !userId ||
      !fullName ||
      !gender ||
      !contact ||
      !email ||
      !programme ||
      !password
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //Hashing the password before updating
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }

      const sqlUpdate = `INSERT INTO internship_db.student (studentId, fullName, gender, contact, email, programme, password) VALUES (?,?,?,?,?,?,?)`;

      // If photo is not provided, pass null so DB default/nullable column works
      //const photoValue = photo || null;

      db.query(
        sqlUpdate,
        [
          userId,
          fullName,
          gender,
          contact,
          email,
          programme,
          hashedPassword,
          // photoValue,
        ],
        (err) => {
          if (err) {
            //console.log("Database error", err);

            // MySQL duplicate entry error
            if (err.code === "ER_DUP_ENTRY") {
              if (err.sqlMessage.includes("email")) {
                return res.status(409).json({
                  error: "Already registered.",
                });
              }
              if (err.sqlMessage.includes("studentId")) {
                return res.status(409).json({
                  error: "Already registered.",
                });
              }
              return res.status(409).json({
                error: "Already registered.",
              });
            }

            return res
              .status(500)
              .json({ error: "Something went wrong. Please try again." });
          }

          res.status(201).json({ message: "Registered successfully." });
          //console.log(result);
        },
      );
    });
  });
}
