// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const {user} = useAuth();
  const userRole = user ? user.role : null;

  // Not logged in
  if (!user) return <Navigate to="/" replace />;

  //  Invalid role
  if (!userRole) return <Navigate to="/" replace />;

  // Not authorized
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="#" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  // userRole: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
