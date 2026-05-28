/**
 * 🔒 RATE LIMITING MIDDLEWARE
 *
 * Prevents brute force attacks by limiting failed login attempts
 * Features:
 * ✅ IP-based rate limiting
 * ✅ Configurable attempt limits
 * ✅ Automatic reset after timeout
 * ✅ Clear error messages
 *
 * Note: For production, use Redis instead of in-memory storage
 */

// ✅ In-memory store for rate limiting (replace with Redis in production)
const rateLimitStore = new Map();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 5; // Max login attempts

/**
 * Get client IP address (handles proxies)
 */
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    "unknown"
  );
};

/**
 * Clean up expired entries
 */
const cleanupExpiredEntries = () => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > DEFAULT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
};

/**
 * Rate limit middleware for login endpoints
 * Usage: app.post("/api/login", rateLimit("login"), loginRoute)
 */
export const rateLimit = (identifier = "general") => {
  return (req, res, next) => {
    try {
      const clientIP = getClientIP(req);
      const role = req.body?.mode;
      const username = req.body?.username; //"anonymous" 👈 extract username
      const key = `${identifier}:${clientIP}:${role}:${username}`;
      const now = Date.now();

      console.log(`Rate limit check for ${key}`);

      // ✅ Cleanup old entries periodically
      if (Math.random() < 0.1) {
        // 10% of requests trigger cleanup
        cleanupExpiredEntries();
      }

      let record = rateLimitStore.get(key);

      // ✅ Initialize or reset if window expired
      if (!record || now - record.resetTime > DEFAULT_WINDOW_MS) {
        record = {
          count: 0,
          resetTime: now,
        };
      }

      // ✅ Increment request count
      record.count++;
      rateLimitStore.set(key, record);

      // ✅ Calculate time remaining in window
      const timeRemaining = Math.ceil(
        (DEFAULT_WINDOW_MS - (now - record.resetTime)) / 1000,
      );

      // ✅ Set rate limit headers
      res.setHeader("X-RateLimit-Limit", DEFAULT_MAX_REQUESTS);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, DEFAULT_MAX_REQUESTS - record.count),
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(record.resetTime + DEFAULT_WINDOW_MS).toISOString(),
      );

      // ✅ Check if limit exceeded
      if (record.count > DEFAULT_MAX_REQUESTS) {
        return res.status(429).json({
          error: ` ${Math.ceil(timeRemaining)}`,
          retryAfter: timeRemaining,
          code: "RATE_LIMIT_EXCEEDED",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limit error:", err);
      // ✅ On error, allow request to proceed (fail open)
      next();
    }
  };
};

/**
 * Reset rate limit for successful login
 */
export const resetRateLimit = (req) => {
  try {
    const clientIP = getClientIP(req);
    const role = req.body?.mode || "unknown";
    const username = req.body?.username || "unknown";
    const key = `login:${clientIP}:${role}:${username}`;

    rateLimitStore.delete(key);
  } catch (err) {
    console.error("Error resetting rate limit:", err);
  }
};

/**
 * Get current rate limit status
 */
export const getRateLimitStatus = (req) => {
  try {
    const clientIP = getClientIP(req);
    const role = req.body?.mode || "unknown";
    const username = req.body?.username || "unknown";
    const key = `login:${clientIP}:${role}:${username}`;

    const record = rateLimitStore.get(key);

    if (!record) {
      return {
        attempts: 0,
        maxAttempts: DEFAULT_MAX_REQUESTS,
        timeRemaining: DEFAULT_WINDOW_MS / 1000,
      };
    }

    const now = Date.now();
    const timeRemaining = Math.ceil(
      (DEFAULT_WINDOW_MS - (now - record.resetTime)) / 1000,
    );

    return {
      attempts: record.count,
      maxAttempts: DEFAULT_MAX_REQUESTS,
      timeRemaining: Math.max(0, timeRemaining),
    };
  } catch (err) {
    console.error("Error getting rate limit status:", err);
    return null;
  }
};
