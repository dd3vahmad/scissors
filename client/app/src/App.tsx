import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import ErrorPage from "./pages/ErrorPage";
import Links from "./pages/Links";
import Link from "./pages/Link";
import CreateNew from "./pages/CreateNew";
import QrCodes from "./pages/QrCodes";
import Pages from "./pages/Pages";
import Analytics from "./pages/Analytics";
import CustomUrls from "./pages/CustomUrls";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import axios from "axios";
import ProtectedRoute from "./rbac/ProtectedRoute";
import AuthProvider from "./context/auth";
import VerifyEmail from "./pages/VerifyEmail";
import EVerificationRoute from "./rbac/EVerification";
import config from "../config/app.config";
import UserProfile from "./pages/UserProfile";

function App() {
  axios.defaults.baseURL = config.server_base_url;
  axios.defaults.withCredentials = true;

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<EVerificationRoute />}>
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/"
              element={<AppLayout />}
              errorElement={<ErrorPage />}
            >
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="links/:id" element={<Link />} />
                <Route path="links" element={<Links />} />
                <Route path="create-new" element={<CreateNew />} />
                <Route path="qrcodes" element={<QrCodes />} />
                <Route path="pages" element={<Pages />} />
                <Route path="custom-urls" element={<CustomUrls />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="user-profile" element={<UserProfile />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
