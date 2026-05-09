/**
 * 🔒 AUTHENTICATION MIDDLEWARE
 *
 * Verifies JWT tokens on protected routes
 * Features:
 * ✅ Token validation with error handling
 * ✅ User context injection into requests
 * ✅ Token expiration checking
 * ✅ Secure error messages (no token exposure)
 */

import jwt from "jsonwebtoken";
import process from "process";
import ROLES from "../../Services/ROLES";

/**
 * Verify JWT Token from cookies or Authorization header
 */
export const verifyToken = (req, res, next) => {
  try {
    // ✅ Try to get token from httpOnly cookie first (most secure)
    const token =
      req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No authorization token provided",
      });
    }

    // ✅ Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // ✅ Attach user info to request for downstream handlers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      issuedAt: new Date(decoded.iat * 1000),
    };

    next();
  } catch (err) {
    // ✅ SECURITY: Different error messages for different JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token has expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token. Please login again.",
        code: "INVALID_TOKEN",
      });
    }

    console.error("Token verification error:", err.message);
    return res.status(401).json({
      error: "Authorization failed. Please login again.",
      code: "AUTH_FAILED",
    });
  }
};

/**
 * Verify Admin Role
 */
export const verifyAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      error: "Insufficient permissions. Admin access required.",
    });
  }

  next();
};

/**
 * Verify user Role
 */
export const verifyVoterRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== ROLES.USER) {
    return res.status(403).json({
      error: "Insufficient permissions. Voter access required.",
    });
  }

  next();
};

/**
 * Verify either Admin or Voter
 */
export const verifyAuth = (req, res, next) => {
  const token =
    req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
