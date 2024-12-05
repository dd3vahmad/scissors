import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
