import { Navigate, Outlet } from "react-router-dom";

const EVerificationRoute = () => {
  const email = localStorage.getItem("new-user-email");

  if (!email) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default EVerificationRoute;
