import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./user/page/HoomePage";
import AdminDashboard from "./admin/components/AdminDashboard";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import Login from "./admin/components/Login";
import AllNoticesViewPage from "./user/page/AllNoticesViewPage";
import ScrollToTop from "./user/components/ScrollToTop";
import NoticeDetailViewPage from "./user/page/NoticeDetailsViewPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Client Below */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notice/:id" element={<NoticeDetailViewPage />} />
        <Route path="/all-notices-view" element={<AllNoticesViewPage />} />

        {/* Admin Below */}
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
