import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import ErrorPage from "./pages/ErrorPage";
import Links from "./pages/Links";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />} errorElement={<ErrorPage />}>
            <Route index element={<Dashboard />} />
            <Route path="links" element={<Links />} />
            <Route path="qrcodes" element={<Links />} />
            <Route path="pages" element={<Links />} />
            <Route path="analytics" element={<Links />} />
            <Route path="settings" element={<Links />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
