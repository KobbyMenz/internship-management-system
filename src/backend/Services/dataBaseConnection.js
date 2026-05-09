import mysql from "mysql2";
import process from "process";
import dotenv from "dotenv";

dotenv.config();

// ✅ OPTIMIZED: Use connection pooling instead of single connection
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust based on expected concurrent users
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// ✅ Get connection and execute query
const query = (sql, args) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, args, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// ✅ Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// ✅ Log pool connection info (dev only)
if (process.env.NODE_ENV === "development") {
  console.log(`Database pool initialized with ${10} max connections`);
}

export { pool, query };
export default pool;
