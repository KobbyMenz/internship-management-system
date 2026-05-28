import db from "../Services/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import dotenv from "dotenv";
import redis from "redis";
import ROLES from "../../Services/ROLES.js";

dotenv.config();

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

const failedLoginAttempts = new Map();
const revokedTokens = new Set();
const refreshTokenSessions = new Map();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 15 * 60 * 1000;
const ATTEMPT_RESET_TIME_MS = 15 * 60 * 1000;

// ✅ FIX 1: Separate JWT expiry (strings) from cookie maxAge (milliseconds)
const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_EXPIRY = "24h";
const ACCESS_TOKEN_MS = 30 * 60 * 1000;
const REFRESH_TOKEN_MS = 24 * 60 * 60 * 1000;

const isAccountLocked = async (identifier) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const attemptData = await redisClient.get(`login_attempts:${identifier}`);
      if (!attemptData) return false;

      const attempts = JSON.parse(attemptData);
      const now = Date.now();

      if (now - attempts.lastAttemptTime > ATTEMPT_RESET_TIME_MS) {
        await redisClient.del(`login_attempts:${identifier}`);
        return false;
      }

      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        const lockTimeRemaining = LOCKOUT_TIME_MS - (now - attempts.lockedAt);
        return lockTimeRemaining > 0;
      }
      return false;
    } else {
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

const recordFailedAttempt = async (identifier) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      const key = `login_attempts:${identifier}`;
      const attemptData = await redisClient.get(key);
      const attempts = attemptData
        ? JSON.parse(attemptData)
        : { count: 0, lastAttemptTime: Date.now(), lockedAt: null };

      attempts.count++;
      attempts.lastAttemptTime = Date.now();
      if (attempts.count >= MAX_FAILED_ATTEMPTS) {
        attempts.lockedAt = Date.now();
      }

      await redisClient.setEx(
        key,
        Math.ceil(ATTEMPT_RESET_TIME_MS / 1000), // ✅ seconds
        JSON.stringify(attempts),
      );
    } else {
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

const validateToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("Token validation error:", err.message);
    return null;
  }
};

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

// ✅ FIX 2: Accept ttlSeconds directly instead of broken string parsing
const revokeToken = async (token, ttlSeconds = 1800) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      await redisClient.setEx(`revoked_token:${token}`, ttlSeconds, "revoked");
    } else {
      revokedTokens.add(token);
    }
  } catch (err) {
    console.error("Error revoking token:", err);
  }
};

const storeRefreshTokenSession = async (refreshToken, userId) => {
  try {
    if (isRedisConnected && redisClient.isOpen) {
      await redisClient.setEx(
        `refresh_session:${refreshToken}`,
        Math.ceil(REFRESH_TOKEN_MS / 1000), // ✅ FIX 3: seconds not milliseconds
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
  app.post("/api/login", async (req, res) => {
    const { username, password, mode } = req.body;

    //console.log("Received login request:", { username, mode });

    if (!username || !password || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ FIX 4: Validate mode is a known role
    if (mode !== ROLES.USER && mode !== ROLES.ADMIN) {
      return res.status(400).json({ error: "Invalid login mode" });
    }

    //Combine mode + username so locks are separate
    const lockIdentifier = `${mode}:${username}`;

    if (await isAccountLocked(lockIdentifier)) {
      return res.status(429).json({
        error:
          "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.",
      });
    }

    try {
      const sqlQuery =
        mode === ROLES.USER
          ? `SELECT * FROM internship_db.student WHERE studentId = ? OR email = ?`
          : `SELECT * FROM internship_db.admin WHERE (adminId = ? OR email = ?) AND status = "Enabled"`;

      db.query(sqlQuery, [username, username], async (err, result) => {
        if (err) {
          console.error("Database error: ", err);
          return res
            .status(500)
            .json({ error: "Authentication service temporarily unavailable" });
        }

        if (result.length === 0) {
          await recordFailedAttempt(lockIdentifier);
          return res.status(401).json({ error: "Wrong credentials" });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, async (err, isMatch) => {
          if (err || !isMatch) {
            await recordFailedAttempt(lockIdentifier);
            return res.status(401).json({ error: "Wrong credentials" });
          }

          await clearFailedAttempts(lockIdentifier);

          const userId = mode === ROLES.USER ? user.studentId : user.adminId;

          // ✅ FIX 1 applied: use string expiry for JWT
          const accessToken = jwt.sign(
            {
              userId,
              role: mode,
              type: "access",
              iat: Math.floor(Date.now() / 1000),
            },
            process.env.VITE_JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: "HS256" },
          );

          const refreshToken = jwt.sign(
            {
              userId,
              role: mode,
              type: "refresh",
              iat: Math.floor(Date.now() / 1000),
            },
            process.env.VITE_REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY, algorithm: "HS256" },
          );

          await storeRefreshTokenSession(refreshToken, userId);

          // ✅ FIX 1 applied: use milliseconds for cookies
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: ACCESS_TOKEN_MS,
            path: "/",
          });

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: REFRESH_TOKEN_MS,
            path: "/",
          });

          return res.status(200).json({
            success: true,
            user: { userId, fullName: user.fullName, role: mode },
            accessToken,
            refreshToken,
            expiresIn: ACCESS_TOKEN_EXPIRY,
            refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
          });
        });
      });
    } catch (err) {
      console.error("Login error: ", err);
      return res
        .status(500)
        .json({ error: "Authentication service temporarily unavailable" });
    }
  });

  app.post("/api/refresh-token", async (req, res) => {
    try {
      const refreshToken =
        req.cookies.refreshToken ||
        req.body.refreshToken ||
        req.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }

      if (await isTokenRevoked(refreshToken)) {
        return res
          .status(401)
          .json({ error: "Refresh token has been revoked" });
      }

      const decoded = validateToken(
        refreshToken,
        process.env.VITE_REFRESH_TOKEN_SECRET,
      );

      if (!decoded || decoded.type !== "refresh") {
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token" });
      }

      if (!(await hasRefreshTokenSession(refreshToken))) {
        return res
          .status(401)
          .json({ error: "Session not found or has been terminated" });
      }

      // ✅ FIX 1 applied: use string expiry for JWT
      const newAccessToken = jwt.sign(
        {
          userId: decoded.userId,
          role: decoded.role,
          type: "access",
          iat: Math.floor(Date.now() / 1000),
        },
        process.env.VITE_JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: "HS256" },
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TOKEN_MS, // ✅ milliseconds for cookie
        path: "/",
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        message: "Token refreshed successfully",
      });
    } catch (err) {
      console.error("Token refresh error: ", err);
      return res.status(500).json({ error: "Token refresh failed" });
    }
  });

  app.post("/api/logout", async (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      // ✅ FIX 2 applied: pass ttl in seconds
      if (accessToken) {
        await revokeToken(accessToken, Math.ceil(ACCESS_TOKEN_MS / 1000));
      }

      if (refreshToken) {
        await revokeToken(refreshToken, Math.ceil(REFRESH_TOKEN_MS / 1000));
        await deleteRefreshTokenSession(refreshToken);
      }

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

      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      console.error("Logout error: ", err);
      return res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/verify-token", async (req, res) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        return res.status(401).json({ error: "No token provided" });
      }

      if (await isTokenRevoked(accessToken)) {
        return res.status(401).json({ error: "Token has been revoked" });
      }

      const decoded = validateToken(accessToken, process.env.VITE_JWT_SECRET);
      if (!decoded || decoded.type !== "access") {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      return res.status(200).json({
        success: true,
        user: { userId: decoded.userId, role: decoded.role },
      });
    } catch (err) {
      console.error("Token verification error: ", err);
      return res.status(500).json({ error: "Token verification failed" });
    }
  });
};

export default loginRoute;
