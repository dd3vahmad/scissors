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
import Settings from "./pages/Settings";
import CustomUrls from "./pages/CustomUrls";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:5700/api/v1";
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<AppLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Dashboard />} />
            <Route path="links" element={<Links />} />
            <Route path="link/:id" element={<Link />} />
            <Route path="create-new" element={<CreateNew />} />
            <Route path="qrcodes" element={<QrCodes />} />
            <Route path="pages" element={<Pages />} />
            <Route path="custom-urls" element={<CustomUrls />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
