import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import "./Details.css";

export default function AddDetails() {
  const location = useLocation();

  return (
    <>
      <h1 className={"title"}>SCHOOL BASE INTERNSHIP FORM</h1>

      <nav className={"nav"}>
        <ul>
          <NavLink
            to={"school_details"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            SCHOOL
          </NavLink>

          <NavLink
            to={"mentor_details"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            MENTOR{" "}
          </NavLink>

          <NavLink
            to={"head_details"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            HEAD{" "}
          </NavLink>
        </ul>
      </nav>

      {/* Redirect /addDetails → /addDetails/school by default */}
      {location.pathname === "/add_details" && <Navigate to="school" replace />}

      <Outlet />
    </>
  );
}
