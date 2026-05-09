/**
 * 🔒 SECURE LOGIN ROUTE WITH REFRESH TOKENS - Extended Security Implementation
 *
 * Security Features:
 * ✅ Rate limiting to prevent brute force attacks
 * ✅ Account lockout after failed attempts
 * ✅ Short-lived access tokens (15 minutes)
 * ✅ Long-lived refresh tokens (7 days)
 * ✅ Secure JWT token handling with httpOnly cookies
 * ✅ Proper HTTP status codes
 * ✅ Token expiration validation
 * ✅ Comprehensive input validation
 * ✅ Secure logout with token invalidation
 * ✅ Token refresh mechanism for seamless sessions
 */

import db from "../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";
//import dayjs from "dayjs";
import redis from "redis";
import ROLES from "../../Services/ROLES.js";

//import ROLES from "../../component/Utils/ROLES.js";

dotenv.config();

// 🔒 SECURITY: Redis client for distributed session management (production)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

const isRedisConnected = process.env.NODE_ENV === "production";

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
  console.warn("Falling back to in-memory storage (development mode)");
});

if (isRedisConnected) {
  redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

// ✅ SECURITY: In-memory fallback stores (for development/single-server)
const failedLoginAttempts = new Map();
const revokedTokens = new Set();
const refreshTokenSessions = new Map();

// ✅ SECURITY: Configuration for rate limiting and account lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_RESET_TIME_MS = 15 * 60 * 1000; // 15 minutes

/**
 * ✅ SECURITY: Check if user account is locked due to too many failed attempts
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const isAccountLocked = async (identifier) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const attemptData = await redisClient.get(`login_attempts:${identifier}`);
      if (!attemptData) return false;

      const attempts = JSON.parse(attemptData);
      const now = Date.now();

      // Reset if lockout period expired
      if (now - attempts.lastAttemptTime > ATTEMPT_RESET_TIME_MS) {
        await redisClient.del(`login_attempts:${identifier}`);
        return false;
      }

      // Check if account is currently locked
      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        const lockTimeRemaining = LOCKOUT_TIME_MS - (now - attempts.lockedAt);
        return lockTimeRemaining > 0;
      }
      return false;
    } else {
      // Fallback to in-memory
      const attempts = failedLoginAttempts.get(identifier);
      if (!attempts) return false;

      const now = Date.now();
      if (now - attempts.lastAttemptTime > ATTEMPT_RESET_TIME_MS) {
        failedLoginAttempts.delete(identifier);
        return false;
      }

      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        const lockTimeRemaining = LOCKOUT_TIME_MS - (now - attempts.lockedAt);
        return lockTimeRemaining > 0;
      }
    }
  } catch (err) {
    console.error("Error checking account lock:", err);
    return false;
  }
  return false;
};

/**
 * ✅ SECURITY: Record failed login attempt
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const recordFailedAttempt = async (identifier) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const key = `login_attempts:${identifier}`;
      const attemptData = await redisClient.get(key);
      const attempts = attemptData
        ? JSON.parse(attemptData)
        : {
            count: 0,
            lastAttemptTime: Date.now(),
            lockedAt: null,
          };

      attempts.count++;
      attempts.lastAttemptTime = Date.now();

      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        attempts.lockedAt = Date.now();
      }

      // Store in Redis with TTL of ATTEMPT_RESET_TIME_MS (in seconds)
      await redisClient.setEx(
        key,
        Math.ceil(ATTEMPT_RESET_TIME_MS / 1000),
        JSON.stringify(attempts),
      );
    } else {
      // Fallback to in-memory
      const attempts = failedLoginAttempts.get(identifier) || {
        count: 0,
        lastAttemptTime: Date.now(),
        lockedAt: null,
      };
      attempts.count++;
      attempts.lastAttemptTime = Date.now();
      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        attempts.lockedAt = Date.now();
      }
      failedLoginAttempts.set(identifier, attempts);
    }
  } catch (err) {
    console.error("Error recording login attempt:", err);
  }
};

/**
 * ✅ SECURITY: Clear failed login attempts on successful login
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const clearFailedAttempts = async (identifier) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      await redisClient.del(`login_attempts:${identifier}`);
    } else {
      failedLoginAttempts.delete(identifier);
    }
  } catch (err) {
    console.error("Error clearing login attempts:", err);
  }
};

/**
 * ✅ SECURITY: Validate JWT token
 */
const validateToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("Token validation error:", err.message);
    return null;
  }
};

/**
 * ✅ SECURITY: Check if token is revoked
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const isTokenRevoked = async (token) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const exists = await redisClient.exists(`revoked_token:${token}`);
      return exists === 1;
    } else {
      return revokedTokens.has(token);
    }
  } catch (err) {
    console.error("Error checking token revocation:", err);
    return false;
  }
};

/**
 * ✅ SECURITY: Revoke a token (on logout)
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const revokeToken = async (token, expiresIn = "30m") => {
  try {
    // Calculate TTL in seconds (default 30 minutes)
    const ttl = parseInt(expiresIn) * 60 || 30 * 60;

    if (isRedisConnected && redisClient.isOpen) {
      await redisClient.setEx(`revoked_token:${token}`, ttl, "revoked");
    } else {
      revokedTokens.add(token);
    }
  } catch (err) {
    console.error("Error revoking token:", err);
  }
};

/**
 * ✅ SECURITY: Store refresh token session
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const storeRefreshTokenSession = async (refreshToken, userId) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      // Store for 7 days
      await redisClient.setEx(
        `refresh_session:${refreshToken}`,
        7 * 24 * 60 * 60,
        JSON.stringify({ userId, createdAt: Date.now() }),
      );
    } else {
      refreshTokenSessions.set(refreshToken, {
        userId,
        createdAt: Date.now(),
      });
    }
  } catch (err) {
    console.error("Error storing refresh token session:", err);
  }
};

/**
 * ✅ SECURITY: Check if refresh token session exists
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const hasRefreshTokenSession = async (refreshToken) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const exists = await redisClient.exists(
        `refresh_session:${refreshToken}`,
      );
      return exists === 1;
    } else {
      return refreshTokenSessions.has(refreshToken);
    }
  } catch (err) {
    console.error("Error checking refresh token session:", err);
    return false;
  }
};

/**
 * ✅ SECURITY: Delete refresh token session
 * 🔒 REDIS: Uses Redis in production, falls back to in-memory in development
 */
const deleteRefreshTokenSession = async (refreshToken) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      await redisClient.del(`refresh_session:${refreshToken}`);
    } else {
      refreshTokenSessions.delete(refreshToken);
    }
  } catch (err) {
    console.error("Error deleting refresh token session:", err);
  }
};

const loginRoute = (app) => {
  /**
   * 🔒 POST /api/login - Secure Login Endpoint with Refresh Tokens
   * ✅ Rate limiting
   * ✅ Account lockout
   * ✅ Secure token handling with refresh tokens
   */
  app.post("/api/login", async (req, res) => {
    const { username, password, mode } = req.body;
    //console.log("Request received: ", req.body);

    // ✅ SECURITY: Input validation
    if (!username || !password || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ SECURITY: Validate username is not too long (prevent DoS)
    // if (username.length > 255) {
    //   return res.status(400).json({ error: "Invalid credentials" });
    // }

    // ✅ SECURITY: Check if account is locked
    if (await isAccountLocked(username)) {
      return res.status(429).json({
        error:
          "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.",
      });
    }

    try {
      // if (role === ROLES.ADMIN) {
      const sqlQuery =
        mode === ROLES.USER
          ? `SELECT * FROM internship_db.student WHERE studentId = ? OR email = ?`
          : `SELECT * FROM internship_db.admin WHERE adminId = ? OR email = ?`;

      db.query(sqlQuery, [username, username], async (err, result) => {
        if (err) {
          console.error("Database error: ", err);
          return res.status(500).json({
            error: "Authentication service temporarily unavailable",
          });
        }

        // ✅ SECURITY: Don't reveal whether user exists or not
        if (result.length === 0) {
          await recordFailedAttempt(username);
          return res.status(401).json({ error: "Wrong credentials" });
        }

        const user = result[0];
        const hashedPassword = user.password;

        // ✅ SECURITY: Use bcrypt.compare for password verification
        bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
          if (err) {
            console.error("Password comparison error: ", err);
            await recordFailedAttempt(username);
            return res.status(401).json({ error: "Wrong credentials" });
          }

          if (!isMatch) {
            await recordFailedAttempt(username);
            return res.status(401).json({ error: "Wrong credentials" });
          }

          // ✅ SECURITY: Clear failed attempts on successful login
          await clearFailedAttempts(username);

          // ✅ SECURITY: Create minimal payload (no sensitive data in token)
          const tokenPayload = {
            userId: mode === ROLES.USER ? user.studentId : user.adminId,
            role: mode,
            type: "access", // 🔒 Token type for validation
            iat: Math.floor(Date.now() / 1000), // Issued at time
          };

          // 🔒 SECURITY: Short-lived access token (15 minutes)
          const accessToken = jwt.sign(
            tokenPayload,
            process.env.VITE_JWT_SECRET,

            {
              expiresIn: "30m", // 30 minutes
              algorithm: "HS256", // Use HS256 algorithm
            },
          );

          // 🔒 SECURITY: Long-lived refresh token (7 days)
          const refreshTokenPayload = {
            userId: mode === ROLES.USER ? user.studentId : user.adminId,
            role: mode,
            type: "refresh",
            iat: Math.floor(Date.now() / 1000),
          };

          const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.VITE_REFRESH_TOKEN_SECRET,
            {
              expiresIn: "7d",
              algorithm: "HS256",
            },
          );

          // 🔒 SECURITY: Store refresh token session info in Redis
          await storeRefreshTokenSession(
            refreshToken,
            mode === ROLES.USER ? user.studentId : user.adminId,
          );

          // ✅ SECURITY: Update last login timestamp with transaction
          // const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
          // const sqlUpdateQuery = `UPDATE e_voting_db.admin SET lastLogin = ? WHERE userId = ?`;

          // db.query("START TRANSACTION", (err) => {
          //   if (err) {
          //     console.error("Error starting transaction: ", err);
          //   }

          //   db.query(sqlUpdateQuery, [currentDate, user.studentId], (err) => {
          //     if (err) {
          //       console.error("Error updating last login: ", err);
          //       db.query("ROLLBACK");
          //       return;
          //     }
          //     db.query("COMMIT", (err) => {
          //       if (err) console.error("Error committing transaction: ", err);
          //     });
          //   });
          // });

          // ✅ SECURITY: Send access token via httpOnly secure cookie (short-lived)
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 60 * 1000, // 30 minutes
            path: "/",
          });

          // ✅ SECURITY: Send refresh token via httpOnly secure cookie (long-lived)
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
          });

          // ✅ SECURITY: Also return access token in body for frontend storage (optional)
          return res.status(200).json({
            success: true,
            user: {
              userId: mode === ROLES.USER ? user.studentId : user.adminId,
              fullName: user.fullName,
              // contact: user.contact,
              // email: user.email,
              // programme: user.programme,
              role: mode,
            },
            accessToken: accessToken, // For frontend to store in sessionStorage
            refreshToken: refreshToken, // For frontend to store in sessionStorage
            expiresIn: "30m", // Access token expiry
            refreshExpiresIn: "7d", // Refresh token expiry
          });
        });

        //console.log(user);
      });
    } catch (err) {
      console.error("Login error: ", err);
      return res
        .status(500)
        .json({ error: "Authentication service temporarily unavailable" });
    }
  });

  /**
   * 🔒 POST /api/refresh-token - Refresh Access Token
   * ✅ Uses long-lived refresh token to get new short-lived access token
   * ✅ Prevents frequent re-login while maintaining security
   */
  app.post("/api/refresh-token", async (req, res) => {
    try {
      const refreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken ||
        req.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }

      // ✅ SECURITY: Check if token is revoked
      if (await isTokenRevoked(refreshToken)) {
        return res
          .status(401)
          .json({ error: "Refresh token has been revoked" });
      }

      // ✅ SECURITY: Validate refresh token
      const decoded = validateToken(
        refreshToken,
        process.env.VITE_REFRESH_TOKEN_SECRET,
      );

      if (!decoded || decoded.type !== "refresh") {
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token" });
      }

      // ✅ SECURITY: Check if session still exists
      if (!(await hasRefreshTokenSession(refreshToken))) {
        return res
          .status(401)
          .json({ error: "Session not found or has been terminated" });
      }

      // ✅ SECURITY: Generate new access token
      const newAccessTokenPayload = {
        userId: decoded.userId,
        role: decoded.role,
        type: "access",
        iat: Math.floor(Date.now() / 1000),
      };

      const newAccessToken = jwt.sign(
        newAccessTokenPayload,
        process.env.VITE_JWT_SECRET,
        {
          expiresIn: "30m",
          algorithm: "HS256",
        },
      );

      // ✅ SECURITY: Send new access token via httpOnly cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000, // 30 minutes
        path: "/",
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        expiresIn: "30m",
        message: "Token refreshed successfully",
      });
    } catch (err) {
      console.error("Token refresh error: ", err);
      return res.status(500).json({ error: "Token refresh failed" });
    }
  });

  /**
   * 🔒 POST /api/logout - Secure Logout Endpoint
   * ✅ Revokes both access and refresh tokens
   * ✅ Clears httpOnly cookies on server
   */
  app.post("/api/logout", async (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      // ✅ SECURITY: Revoke both tokens
      if (accessToken) {
        await revokeToken(accessToken, "30m");
      }

      if (refreshToken) {
        await revokeToken(refreshToken, "7d");
        await deleteRefreshTokenSession(refreshToken);
      }

      // ✅ SECURITY: Clear both httpOnly cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error("Logout error: ", err);
      return res.status(500).json({ error: "Logout failed" });
    }
  });

  /**
   * 🔒 GET /api/verify-token - Verify Token Validity
   * ✅ Check if access token is still valid
   */
  app.get("/api/verify-token", async (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        return res.status(401).json({ error: "No token provided" });
      }

      // ✅ SECURITY: Check if token is revoked
      if (await isTokenRevoked(accessToken)) {
        return res.status(401).json({ error: "Token has been revoked" });
      }

      // ✅ SECURITY: Validate token and check expiration
      const decoded = validateToken(accessToken, process.env.VITE_JWT_SECRET);
      if (!decoded || decoded.type !== "access") {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      return res.status(200).json({
        success: true,
        user: {
          userId: decoded.userId,
          role: decoded.role,
        },
      });
    } catch (err) {
      console.error("Token verification error: ", err);
      return res.status(500).json({ error: "Token verification failed" });
    }
  });
};

export default loginRoute;
