import { Navigate } from "react-router-dom";

const RoleGuard = ({ user, allowedRole, children, redirectTo = "/" }) => {
  if (!user) return <Navigate to="/login" />;

  if (user.role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleGuard;
