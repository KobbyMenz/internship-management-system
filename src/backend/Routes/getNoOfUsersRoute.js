import db from "../Services/dataBaseConnection.js";

const getNoOfUsersRoute = (app) => {
  // Route to get the number of users
  app.get("/api/getNoOfUsers", (req, res) => {
    const sqlQuery = `SELECT COUNT(*) AS noOfUsers FROM internship_db.student`;

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        totalUsers: result[0].noOfUsers,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });

  // Route to get the number of male users
  app.get("/api/getNoOfMales", (req, res) => {
    const sqlQuery = `SELECT COUNT(*) AS noOfMales FROM internship_db.student 
    WHERE gender = "Male"`;

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        totalMales: result[0].noOfMales,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });

  // Route to get the number of female users
  app.get("/api/getNoOfFemales", (req, res) => {
    const sqlQuery = `SELECT COUNT(*) AS noOfFemales FROM internship_db.student 
    WHERE gender = "Female"`;

    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.log("Error fetching data", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json({
        totalFemales: result[0].noOfFemales,
      }); //Sending the query result back to json.
      // console.log(result);
    });
  });
};
export default getNoOfUsersRoute;
