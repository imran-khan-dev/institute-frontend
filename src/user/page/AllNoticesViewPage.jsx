import { useEffect } from "react";
import AllNoticesView from "../components/AllNoticesView";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImportantLinkSidebar from "../components/ImportantLinksSidebar";
import NoticeSidebar from "../components/NoticeSidebar";
import Slider from "../components/Slider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AllNoticesViewPage() {
  useEffect(() => {
    document.title = "সকল নোটিশ সূমহ";
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header apiBaseUrl={API_BASE_URL} />
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-12">
        <Slider apiBaseUrl={API_BASE_URL} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left content */}
          <AllNoticesView apiBaseUrl={API_BASE_URL} />

          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-8">
            <NoticeSidebar apiBaseUrl={API_BASE_URL} />
            <ImportantLinkSidebar apiBaseUrl={API_BASE_URL} />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
