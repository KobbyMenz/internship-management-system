/**
 * 🔒 SECURITY HEADERS MIDDLEWARE
 *
 * Implements essential security headers to protect against:
 * ✅ Clickjacking attacks
 * ✅ MIME type sniffing
 * ✅ XSS attacks
 * ✅ Insecure transport
 * ✅ CSRF attacks
 */

import process from "process";

export const securityHeaders = (req, res, next) => {
  // ✅ Prevent Clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // ✅ Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // ✅ Enable XSS Protection (legacy, but still useful)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // ✅ Referrer Policy - Don't send referrer to external sites
  res.setHeader("Referrer-Policy", "no-referrer");

  // ✅ Permissions Policy (formerly Feature Policy)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()",
  );

  // ✅ Content Security Policy - Prevent inline scripts and external resource loading
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'",
  );

  // ✅ Strict Transport Security - Force HTTPS
  // Only set in production with HTTPS
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  next();
};

/**
 * Request logging middleware for security auditing
 */
export const securityAuditLog = (req, res, next) => {
  const startTime = Date.now();

  // ✅ Log request details for audit trail
  const requestLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
  };

  // Log sensitive operations
  if (
    req.method !== "GET" ||
    req.path.includes("/api/login") ||
    req.path.includes("/api/logout")
  ) {
    console.log("🔐 Security Audit:", requestLog);
  }

  // ✅ Capture response time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      // Log slow requests
      console.warn("⚠️ Slow Request:", {
        ...requestLog,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * CORS configuration for security
 */
export const securityCORS = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.VITE_APP_URL,
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000", // Alternative dev port
      "http://localhost:5000", // Backend port
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
  maxAge: 86400, // 24 hours
};
