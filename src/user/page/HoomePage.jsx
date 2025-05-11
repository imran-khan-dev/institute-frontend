import { useEffect } from "react";
import AboutInstitute from "../components/AboutInstitute";
import Footer from "../components/Footer";
import GoverningBody from "../components/GoverningBody";
import Header from "../components/Header";
import ImportantLinkSidebar from "../components/ImportantLinksSidebar";
import MediaGallery from "../components/MediaGallery";
import NoticeSidebar from "../components/NoticeSidebar";
import Slider from "../components/Slider";

function HomePage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    document.title = "এক্স ওয়াই জেড বিদ্যালয়";
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header apiBaseUrl={API_BASE_URL} />
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-12">
        <Slider apiBaseUrl={API_BASE_URL} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-10">
            {/* About Institute */}
            <AboutInstitute apiBaseUrl={API_BASE_URL} />

            {/* Governing Body */}
            <GoverningBody apiBaseUrl={API_BASE_URL} />
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-8">
            {/* Notices */}
            <NoticeSidebar apiBaseUrl={API_BASE_URL} />
            {/* Links */}
            <ImportantLinkSidebar apiBaseUrl={API_BASE_URL} />
          </aside>
        </div>

        <MediaGallery apiBaseUrl={API_BASE_URL} />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
