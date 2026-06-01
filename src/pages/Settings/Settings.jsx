import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import "../Details/Details.css";

export default function Settings() {
  const location = useLocation();

  return (
    <>
      <h1 className={"title"}></h1>

      <nav className={"nav"}>
        <ul>
          {/* <NavLink
            to={"manage_system"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            Manage System
          </NavLink> */}

          <NavLink
            to={"manage_student"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            Manage Students{" "}
          </NavLink>

          <NavLink
            to={"manage_admin"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            Manage Admins{" "}
          </NavLink>
        </ul>
      </nav>

      {/* Redirect /settings → /settings/manage_system by default */}
      {location.pathname === "/admin/settings" && (
        <Navigate to="manage_student" replace />
      )}

      <Outlet />
    </>
  );
}
