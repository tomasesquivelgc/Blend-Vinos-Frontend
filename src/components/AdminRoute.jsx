import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // If user data isn't loaded yet
  if (!user) return <Navigate to="/" replace />;

  // Only allow roleId === 1 (admin)
  if (user.rol_id !== 1) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
