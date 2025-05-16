import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NotFound() {
  return (
    <>
      <Header apiBaseUrl={API_BASE_URL} />
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">404 - নট ফাউন্ড</h1>
        <p className="my-4">
          আপনার কাঙ্ক্ষিত পেজটি ওয়েবসাইটে খুঁজে পাওয়া যায়নি
        </p>
        <Link
          to={"/"}
          className="text-center bg-[#057957] text-white font-semibold px-3 py-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          হোমে ফিরুন
        </Link>
      </div>
      <Footer />
    </>
  );
}
