import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./components/Form/SignIn";
import MainHeader from "./components/MainHeader/MainHeader";
import SignUp from "./components/Form/SignUp";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ROLES from "./Services/ROLES";
import Profile from "./pages/Profile/ProfileContent";
// 🔒 SECURITY: Import secure logout service
import {
  // secureLogout,
  setupTokenExpiration,
  setupAutoTokenRefresh,
} from "./Services/secureLogout";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "./context/useAuth";
import Dashboard from "./pages/Dashboard/Dashboard";
import HeadDetails from "./pages/Details/HeadDetails";
import SchoolDetails from "./pages/Details/SchoolDetails";
import MentorDetails from "./pages/Details/MentorDetails";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

function App() {
  // ✅ FIXED: Initialize state from sessionStorage to avoid setState in effect
  // const [isLoggedIn] = useState(() => {
  //   return JSON.parse(sessionStorage.getItem("isLoggedIn")) || false;
  // });

  const { isLoggedIn, logout } = useAuth();

  const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes
  const inactivityTimerRef = useRef(null);
  const tokenExpirationRef = useRef(null); // 🔒 Track token expiration timer
  const autoRefreshTokenRef = useRef(null); // 🔒 Track auto token refresh timer

  // ✅ FIXED: Separated logout logic - now with secure backend logout
  const logoutHandler = useCallback(() => {
    // 🔒 SECURITY: Call secure logout that invalidates token on backend
    logout();

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (tokenExpirationRef.current) {
      clearTimeout(tokenExpirationRef.current);
      tokenExpirationRef.current = null;
    }

    if (autoRefreshTokenRef.current) {
      clearTimeout(autoRefreshTokenRef.current);
      autoRefreshTokenRef.current = null;
    }
  }, [logout]);

  // ✅ OPTIMIZED: Inactivity timeout effect - separate and minimal dependencies
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    const resetInactivity = () => {
      // ✅ FIXED: Clear existing timer before setting new one
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        logoutHandler();
      }, INACTIVITY_TIME);
    };

    // ✅ Attach listeners once
    events.forEach((ev) => window.addEventListener(ev, resetInactivity));

    // Start initial timer
    resetInactivity();

    // ✅ Proper cleanup
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetInactivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [isLoggedIn, logoutHandler, INACTIVITY_TIME]); // ✅ Reduced dependency issues

  // 🔒 SECURITY: Setup automatic token refresh and logout on expiration
  useEffect(() => {
    if (!isLoggedIn) return;

    // Setup automatic token refresh (refreshes 2 minutes before expiration)
    autoRefreshTokenRef.current = setupAutoTokenRefresh(() => {
      console.warn("⚠️ Token refresh failed, logging out...");
      logoutHandler();
    });

    // Setup automatic logout as fallback (on actual token expiration)
    tokenExpirationRef.current = setupTokenExpiration(() => {
      logoutHandler();
    });

    return () => {
      if (autoRefreshTokenRef.current) {
        clearTimeout(autoRefreshTokenRef.current);
        autoRefreshTokenRef.current = null;
      }
      if (tokenExpirationRef.current) {
        clearTimeout(tokenExpirationRef.current);
        tokenExpirationRef.current = null;
      }
    };
  }, [isLoggedIn, logoutHandler]);
  ///////////////////////////////////////////////

  ///////////////////////////////////////
  //Disabling right click and keyboard shortcuts
  ///////////////////////////////////////
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener("contextmenu", handleContextMenu);

  //   const disableShortcuts = (e) => {
  //     if (
  //       (e.ctrlKey && e.shiftKey && e.key === "I") ||
  //       (e.ctrlKey && e.shiftKey && e.key === "J") ||
  //       (e.ctrlKey && e.key === "U") ||
  //       e.key === "F12"
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener("keydown", disableShortcuts);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("keydown", disableShortcuts);
  //   };
  // }, []);
  //////////////////////////////////////////////

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer />

      {/*========= Header ==========*/}
      {isLoggedIn && <MainHeader />}

      <div className="route-container">
        <Routes>
          {/*======= Global Routes =======*/}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="*"
            element={<h2 className="not_found_page">401 | Page not found</h2>}
          />

          {/*====== Protected Admin Routes ======*/}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            {/*ADMIN ROUTES HERE*/}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/*====== Protected User Routes ======*/}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schoolDetails" element={<SchoolDetails />} />
            <Route path="/mentorDetails" element={<MentorDetails />} />
            <Route path="/headDetails" element={<HeadDetails />} />
          </Route>
        </Routes>
      </div>
      {/* </AuthContextProvider> */}
    </>
  );
}

export default App;
