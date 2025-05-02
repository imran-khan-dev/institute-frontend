import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaNewspaper,
  FaListUl,
  FaSlidersH,
  FaLink,
  FaSchool,
  FaUniversity,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import GoverningBodyControl from "./GoverningBodyControl";
import SliderControl from "./SliderControl";
import NoticeControl from "./NoticeControl";
import UpdateHeadlineControl from "./UpdateHeadlineControl";
import LinkManager from "./LinkManager";
import InstituteCodesControl from "./InstituteCode";
import AboutInstituteControl from "./AboutInstitute";
import MediaGalleryControl from "./MediaGalleryControl";
import Greeting from "./Greetings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  const navigate = useNavigate();

  const handleAdminTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("adminActiveTab", tab);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "dashboard" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "update-headline" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("update-headline")}
          >
            <FaNewspaper /> Headline
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "notice" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("notice")}
          >
            <FaListUl /> Manage Notices
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "slider" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("slider")}
          >
            <FaSlidersH /> Manage Slider
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "governingBody" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("governingBody")}
          >
            <FaUserShield /> Manage GB
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "mediaGallery" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("mediaGallery")}
          >
            <FaUserShield /> Media Gallery
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "linkManager" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("linkManager")}
          >
            <FaLink /> Link Manager
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "instituteCodes" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("instituteCodes")}
          >
            <FaUniversity /> Institute Code
          </button>

          <button
            className={`flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded ${
              activeTab === "aboutInstitute" ? "bg-blue-500" : ""
            }`}
            onClick={() => handleAdminTab("aboutInstitute")}
          >
            <FaSchool /> About Institute
          </button>

          <button
            onClick={() => handleLogout()}
            className="flex items-center gap-2 p-2 w-full font-bold cursor-pointer rounded mt-6 bg-red-500 hover:bg-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <header className="bg-white shadow p-4 rounded-lg flex justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "slider" && "Manage Slider"}
            {activeTab === "governingBody" && "Governing Body Management"}
            {activeTab === "notice" && "Notice Management"}
            {activeTab === "update-headline" && "Update Headline Management"}
            {activeTab === "linkManager" && "Important Links Management"}
            {activeTab === "instituteCodes" && "Institute Codes Management"}
            {activeTab === "aboutInstitute" && "About Institute"}
            {activeTab === "aboutSchool" && "institute Codes Management"}
            {activeTab === "mediaGallery" && "Media Gallery Management"}
          </h1>
          <span className="text-gray-600">Welcome, Admin</span>
        </header>

        {/* Page Content */}
        <section className="mt-6">
          {activeTab === "dashboard" && <Greeting />}
          {activeTab === "governingBody" && <GoverningBodyControl />}
          {activeTab === "slider" && <SliderControl />}
          {activeTab === "notice" && <NoticeControl />}
          {activeTab === "linkManager" && <LinkManager />}
          {activeTab === "update-headline" && <UpdateHeadlineControl />}
          {activeTab === "instituteCodes" && <InstituteCodesControl />}
          {activeTab === "aboutInstitute" && <AboutInstituteControl />}
          {activeTab === "mediaGallery" && <MediaGalleryControl />}
        </section>
      </main>
    </div>
  );
}
