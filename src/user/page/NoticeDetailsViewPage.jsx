import { useEffect } from "react";
import Header from "../components/Header";
import Slider from "../components/Slider";
import NoticeSidebar from "../components/NoticeSidebar";
import NoticeDetail from "../components/NoticeDetail";
import ImportantLinkSidebar from "../components/ImportantLinksSidebar";
import Footer from "../components/Footer";

const NoticeDetailViewPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    document.title = "সকল নোটিশ সূমহ";
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header apiBaseUrl={API_BASE_URL} />
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
        <Slider apiBaseUrl={API_BASE_URL} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left content */}
          <NoticeDetail apiBaseUrl={API_BASE_URL} />

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
};

export default NoticeDetailViewPage;
