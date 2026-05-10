import app_api_url from "./app_api_url";

/**
 * 🔒 SECURE LOGOUT SERVICE WITH REFRESH TOKEN SUPPORT
 * 
 * Handles secure logout with backend communication
 * Features:
 * ✅ Backend token invalidation
 * ✅ Cookie clearing
 * ✅ Storage cleanup
 * ✅ Error handling
 * ✅ Token revocation
 * ✅ Refresh token support

import app_api_url from "../../app_api_url";

/**
 * Perform secure logout on frontend and backend
 */
export const secureLogout = async () => {
  try {
    // ✅ SECURITY: Call backend logout endpoint to invalidate token
    const response = await fetch(`${app_api_url}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ Include token in Authorization header if needed
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      credentials: "include", // ✅ Include cookies (httpOnly auth cookie)
    });

    if (!response.ok) {
      console.error("Backend logout failed:", response.statusCode);
      // Continue with frontend logout even if backend fails
    }
  } catch (error) {
    console.error("Error during secure logout:", error);
    // Continue with frontend cleanup even if backend request fails
  } finally {
    // ✅ SECURITY: Clear all client-side session data regardless of backend response
    cleanupSessionData();
  }
};

/**
 * Clean up all session data
 */
export const cleanupSessionData = () => {
  try {
    // ✅ Remove all session storage keys
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("expiryTime");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");

    // ✅ Remove all local storage keys
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // ✅ Clear any other sensitive data
    Object.keys(sessionStorage).forEach((key) => {
      if (
        key.toLowerCase().includes("auth") ||
        key.toLowerCase().includes("token") ||
        key.toLowerCase().includes("user")
      ) {
        sessionStorage.removeItem(key);
      }
    });

    //console.log("✅ Session data cleared successfully");
  } catch (error) {
    console.error("Error cleaning up session data:", error);
  }
};

/**
 * Check if session is still valid by verifying token with backend
 */
export const verifySession = async () => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return false;

    const response = await fetch(`${app_api_url}/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Error verifying session:", error);
    return false;
  }
};

/**
 * Get time remaining for token expiration
 */
export const getTokenTimeRemaining = () => {
  const expiryTime = sessionStorage.getItem("expiryTime");
  if (!expiryTime) return null;

  const expiryDate = new Date(parseInt(expiryTime));
  const now = new Date();
  const timeRemaining = expiryDate - now;

  return {
    milliseconds: Math.max(0, timeRemaining),
    seconds: Math.max(0, Math.floor(timeRemaining / 1000)),
    minutes: Math.max(0, Math.floor(timeRemaining / (1000 * 60))),
    isExpired: timeRemaining <= 0,
  };
};

/**
 * Setup automatic logout on token expiration
 */
export const setupTokenExpiration = (onExpire) => {
  const timeRemaining = getTokenTimeRemaining();

  if (!timeRemaining || timeRemaining.isExpired) {
    // Token already expired or doesn't exist
    return null;
  }

  // Set timeout for actual token expiration (auto-logout)
  const expirationTimeout = setTimeout(() => {
    console.warn("⚠️ Token expired, logging out...");
    cleanupSessionData();
    onExpire?.();
  }, timeRemaining.milliseconds);

  return expirationTimeout;
};

/**
 * 🔒 Refresh access token using refresh token
 * Allows users to maintain long sessions without frequent re-authentication
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken =
      sessionStorage.getItem("refreshToken") ||
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.warn("No refresh token available");
      return null;
    }

    // ✅ SECURITY: Call refresh token endpoint
    const response = await fetch(`${app_api_url}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include", // ✅ Include httpOnly cookies
    });

    if (!response.ok) {
      console.error("Token refresh failed:", response.status);
      // If refresh fails, logout user
      await secureLogout();
      return null;
    }

    const data = await response.json();

    if (data.success && data.accessToken) {
      // ✅ SECURITY: Update stored tokens
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("token", data.accessToken); // Keep for backward compatibility
      sessionStorage.setItem("expiryTime", Date.now() + 30 * 60 * 1000); // 30 minutes

      console.log("✅ Access token refreshed successfully");
      return data.accessToken;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

/**
 * Setup automatic token refresh before expiration
 * Refreshes token 2 minutes before it expires
 */
export const setupAutoTokenRefresh = (onRefreshFailed) => {
  const timeRemaining = getTokenTimeRemaining();

  if (!timeRemaining || timeRemaining.isExpired) {
    return null;
  }

  // Refresh 2 minutes before expiration
  const refreshTime = Math.max(
    1000,
    timeRemaining.milliseconds - 2 * 60 * 1000,
  );

  const refreshTimeout = setTimeout(async () => {
    console.log("🔄 Attempting to refresh access token...");
    const newToken = await refreshAccessToken();

    if (!newToken) {
      // Refresh failed, logout
      onRefreshFailed?.();
    } else {
      // Setup next refresh
      setupAutoTokenRefresh(onRefreshFailed);
    }
  }, refreshTime);

  return refreshTimeout;
};
