import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config(); //Loading environment variables
//import { console } from "inspector";
import process from "process";
import createBackup from "./Services/createBackup.js";
//import cron from "node-cron";

// 🔒 Security Middleware Imports
import {
  securityHeaders,
  securityAuditLog,
  securityCORS,
} from "./Middleware/securityHeaders.js";
import { rateLimit } from "./Middleware/rateLimitMiddleware.js";
// 🔒 SECURITY: Use secure login route with refresh tokens
import loginRoute from "./Routes/loginRoute.js";
import getStudentRoute from "./Routes/getStudentRoute.js";
import getSchoolDetailsRoute from "./Routes/getSchoolDetailsRoute.js";
import getMentorDetailsRoute from "./Routes/getMentorDetailsRoute.js";

const app = express();

/*
===============================================
🔒 SECURITY MIDDLEWARE - Apply to all routes
===============================================*/
// ✅ SECURITY: Add security headers to all responses
app.use(securityHeaders);

// ✅ SECURITY: Log security-relevant requests
app.use(securityAuditLog);

/*
======================================
Setting up cross-origin requests (CORS)
======================================*/
// ✅ SECURITY: Enhanced CORS configuration
app.use(cors(securityCORS));

//  Middleware
/*=========================*/
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
////////////////////////////////////////////////////////////////

/*
  LOGIN - 🔒 Secure Login with Rate Limiting
===================================*/
// ✅ Apply rate limiting middleware to login endpoint
app.post("/api/login", rateLimit("login"));

// Use the secure login route with proper async handling and security features
loginRoute(app);

/*
==================================
STUDENT ROUTES
===================================*/
getStudentRoute(app);

/*
==================================
SCHOOL ROUTES
===================================*/
getSchoolDetailsRoute(app);

/*
==================================
MENTOR ROUTES
===================================*/
getMentorDetailsRoute(app);

/*Schedule a backup every 1 hour
==================================*/
// cron.schedule("0 * * * *", () => {
//   console.log("Running scheduled hourly backup...");
//   try {
//     const result = createBackup();

//     if (result && result.success) {
//       console.log("Scheduled backup succeeded:", result.message, result.path);
//     } else {
//       console.error("Scheduled backup reported failure:", result);
//     }
//   } catch (err) {
//     console.error("Scheduled backup failed:", err);
//   }
// });

/* Manual trigger backup by clicking React button
==================================================*/
app.get("/api/backup", async (req, res) => {
  try {
    const result = await createBackup();
    if (result) {
      console.log("Backup created successfully");
      return res.json({
        message: result,
      });
    }
  } catch (err) {
    console.error("Manual backup failed:", err);
    // err may be an object with success:false
    if (err) {
      console.log("Backup failed with error message");
      return res.json({
        message: `Backup failed with error message: ${err}`,
      });
    }
  }
});
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/*

==================================
STARTING SERVER 
==================================
*/
const port = process.env.VITE_PORT;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
