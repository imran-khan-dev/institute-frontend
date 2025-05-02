import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./user/components/Home";
import AdminDashboard from "./admin/components/AdminDashboard";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import Login from "./admin/components/Login";
import NoticeDetail from "./user/components/NoticeDetail";
import AllNoticesView from "./user/components/AllNoticesView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Below */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        <Route path="/all-notices-view" element={<AllNoticesView />} />

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
