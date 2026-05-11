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
            to={"schoolDetails"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            School
          </NavLink>

          <NavLink
            to={"mentorDetails"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            Mentor{" "}
          </NavLink>

          <NavLink
            to={"headDetails"}
            className={({ isActive }) => (isActive ? `${"active li"}` : `li`)}
          >
            Headteacher{" "}
          </NavLink>
        </ul>
      </nav>

      {/* Redirect /add-details → /add-details/school by default */}
      {location.pathname === "/addDetails" && <Navigate to="school" replace />}

      <Outlet />
    </>
  );
}
