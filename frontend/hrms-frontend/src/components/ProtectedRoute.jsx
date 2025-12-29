import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role")?.toLowerCase() || "";

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  
  const isAllowed = allowedRoles.some(
    (r) => r.toLowerCase() === role
  );

  if (!isAllowed) {
    console.log(`Access denied: role "${role}" not allowed. Allowed:`, allowedRoles);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;