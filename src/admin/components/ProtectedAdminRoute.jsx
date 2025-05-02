import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Prop validation for children prop
ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
