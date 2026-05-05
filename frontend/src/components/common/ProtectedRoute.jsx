import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ROLE CHECK
  if (allowedRole) {
    const allowedRoles = Array.isArray(
      allowedRole
    )
      ? allowedRole
      : [allowedRole];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;