import { useEffect, useState } from "react";
import {
  FaBars,
  FaLink,
  FaListUl,
  FaNewspaper,
  FaSchool,
  FaSignOutAlt,
  FaSlidersH,
  FaTachometerAlt,
  FaTimes,
  FaUniversity,
  FaUserShield,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AboutInstituteControl from "./AboutInstitute";
import GoverningBodyControl from "./GoverningBodyControl";
import Greeting from "./Greetings";
import InstituteCodesControl from "./InstituteCode";
import LinkManager from "./LinkManager";
import MediaGalleryControl from "./MediaGalleryControl";
import NoticeControl from "./NoticeControl";
import SliderControl from "./SliderControl";
import UpdateHeadlineControl from "./UpdateHeadlineControl";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  const handleAdminTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("adminActiveTab", tab);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const TAB_LABELS = {
    dashboard: "Dashboard",
    slider: "Manage Slider",
    governingBody: "Governing Body Management",
    notice: "Notice Management",
    updateHeadline: "Update Headline Management",
    linkManager: "Important Links Management",
    instituteCodes: "Institute Codes Management",
    aboutInstitute: "About Institute",
    mediaGallery: "Media Gallery Management",
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Toggle Button */}
      <div className="md:hidden bg-blue-600 text-white flex justify-between items-center p-4 cursor-pointer">
        <h2
          onClick={() => {
            setActiveTab("dashboard");
            handleAdminTab("dashboard");
          }}
          className="text-lg font-bold"
        >
          Admin Panel
        </h2>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-600 text-white w-full md:w-64 p-4 flex-col space-y-3 ${
          sidebarOpen ? "flex" : "hidden"
        } md:flex`}
      >
        <nav className="space-y-3">
          {[
            ["dashboard", FaTachometerAlt, "Dashboard"],
            ["updateHeadline", FaNewspaper, "Headline"],
            ["notice", FaListUl, "Manage Notices"],
            ["slider", FaSlidersH, "Manage Slider"],
            ["governingBody", FaUserShield, "Manage GB"],
            ["mediaGallery", FaUserShield, "Media Gallery"],
            ["linkManager", FaLink, "Link Manager"],
            ["instituteCodes", FaUniversity, "Institute Code"],
            ["aboutInstitute", FaSchool, "About Institute"],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              className={`flex items-center gap-2 p-2 w-full cursor-pointer font-bold rounded ${
                activeTab === key ? "bg-blue-500" : ""
              }`}
              onClick={() => handleAdminTab(key)}
            >
              <Icon /> {label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 w-full font-bold rounded mt-4 cursor-pointer bg-red-500 hover:bg-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Top Bar */}
        <header className="bg-white shadow p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">
            {TAB_LABELS[activeTab] || "Untitled"}
          </h1>
          <span className="text-gray-600">Welcome, Admin</span>
        </header>

        {/* Content */}
        <section>
          {activeTab === "dashboard" && <Greeting />}
          {activeTab === "governingBody" && <GoverningBodyControl />}
          {activeTab === "slider" && <SliderControl />}
          {activeTab === "notice" && <NoticeControl />}
          {activeTab === "linkManager" && <LinkManager />}
          {activeTab === "updateHeadline" && <UpdateHeadlineControl />}
          {activeTab === "instituteCodes" && <InstituteCodesControl />}
          {activeTab === "aboutInstitute" && <AboutInstituteControl />}
          {activeTab === "mediaGallery" && <MediaGalleryControl />}
        </section>
      </main>
    </div>
  );
}
