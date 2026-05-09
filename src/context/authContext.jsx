import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/UI/Notification/Toast";
import app_api_url from "../Services/app_api_url";
import axios from "axios";
import ROLES from "../Services/ROLES";
import { secureLogout } from "../Services/secureLogout";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // const closeLoaderLogin = () => {
  //   setLoadingLogin(false);
  //   // setLoadingLogin((prev) => !prev);
  // };

  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(sessionStorage.getItem("isLoggedIn")) || false,
  );

  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  );

  // Auto-unlock account when lockout expires
  useEffect(() => {
    if (isAccountLocked) {
      setIsAccountLocked(false);
      setShowLockoutModal(true);
    }

    setIsLoggedIn(JSON.parse(sessionStorage.getItem("isLoggedIn")) || false);
  }, [isAccountLocked]);

  const navigate = useNavigate();

  // Login function to update login status and user data
  const login = (userData) => {
    //=======Making API call to the backend for LOGIN============
    const auth = async () => {
      setLoadingLogin(true);
      //closeLoaderLogin();
      console.log(userData);
      try {
        //172.20.10.4
        const response = await axios.post(
          // "http://localhost:3001/api/login",
          `${app_api_url}/login`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials for cookie handling
          },
        );
        // Store tokens and user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);

        const savedUserData = JSON.parse(localStorage.getItem("user")) || {};
        setUser(savedUserData);

        // Calculate 15-minute expiry time
        const expiryTimestamp = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds
        sessionStorage.setItem("expiryTime", JSON.stringify(expiryTimestamp));

        if (response.data) setLoadingLogin(false);

        //==========checking for admin login============
        if (
          response.data.accessToken &&
          response.data.user.role === ROLES.ADMIN
        ) {
          navigate("/admin/dashboard");
          setIsLoggedIn(true); // ✅ add this line
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        }

        //==========checking for user login============
        if (
          response.data.accessToken &&
          response.data.user.role === ROLES.USER
        ) {
          navigate("/dashboard");
          setIsLoggedIn(true); // ✅ add this line
          sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        }
      } catch (err) {
        // 🔒 Handle account lockout (429 Too Many Requests)
        if (err.response && err.response.status === 429) {
          setIsAccountLocked(true);
          setShowLockoutModal(true);
          Toast(
            "error",
            `Too many failed login attempts. Please try again in ${Math.floor(
              (err.response.data.error % 3600) / 60,
            )
              .toString()
              .padStart(2, "0")}:${Math.floor(err.response.data.error % 60)
              .toString()
              .padStart(2, "0")}`,
          );
          localStorage.setItem(
            "LOCKOUT_TIMESTAMP_KEY",
            err.response.data.error,
          );
          // setError(true);
          setLoadingLogin(false);
        }
        // ❌ Handle invalid credentials (401 Unauthorized)
        else if (err.response && err.response.data && err.response.data.error) {
          Toast("error", err.response.data.error);
          // setError(true);
          setLoadingLogin(false);
        }
        // ❌ Handle other error responses with message field
        else if (
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          Toast("error", err.response.data.message);
          // setError(true);
          setLoadingLogin(false);
        }
        // 🌐 Handle network errors
        else {
          Toast("error", "Network error! Server cannot be reached");
          setLoadingLogin(false);
        }
      }
    };
    auth();
  };

  // Logout function to clear user data and update login status
  const logout = async () => {
    setIsLoggedIn(false);

    localStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");

    // 🔒 SECURITY: Call secure logout that invalidates token on backend
    await secureLogout();

    //navigate to sign-in page after logout
    navigate("/");
  };

  // Provide the context value to children components
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          isLoggedIn,
          login,
          logout,
          showLockoutModal,
          setShowLockoutModal,
          loadingLogin,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
