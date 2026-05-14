import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OWNER_ADMIN_EMAIL = "horbahstech@gmail.com";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isOwnerAdmin = user?.email?.toLowerCase() === OWNER_ADMIN_EMAIL;

  if (!adminOnly && isOwnerAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (adminOnly && !isOwnerAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
