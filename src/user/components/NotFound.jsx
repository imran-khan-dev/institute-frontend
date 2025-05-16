import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NotFound() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header apiBaseUrl={API_BASE_URL} />

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mt-14 md:mt-0">404 - নট ফাউন্ড</h1>
        <p className="my-4">
          আপনার কাঙ্ক্ষিত পেজটি ওয়েবসাইটে খুঁজে পাওয়া যায়নি
        </p>
        <Link
          to="/"
          className="bg-[#057957] text-white font-semibold px-3 py-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          হোমে ফিরুন
        </Link>
      </main>

      <Footer />
    </div>
  );
}
