import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
