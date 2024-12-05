import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../rbac/ProtectedRoute";

const AppLayout = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <Outlet />
    </ProtectedRoute>
  );
};

export default AppLayout;
