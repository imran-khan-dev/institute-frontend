import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchNotices = async (page, setNotices, setTotalPages) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notices?page=${page}&limit=10`
    );
    const data = await response.json();
    setNotices(data.notices);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching notices:", error);
  }
};

export default function AllNoticesView() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotices(page, setNotices, setTotalPages);
  }, [page]);

  useEffect(() => {
    document.title = "সকল নোটিশ সূমহ";
  }, []);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        to="/"
        className="bg-blue-600 text-white font-semibold px-5 py-3 rounded hover:bg-red-600 hover:scale-105 transition w-max"
      >
        Home
      </Link>
      {/* Notice List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 cursor-pointer mt-10">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="p-8 border rounded-lg flex items-center justify-between transition relative"
          >
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold text-gray-700 mb-3">
                {notice.title}
              </h2>
              <p className="text-gray-700 text-xl mb-4">{notice.description}</p>
              <Link
                to={`/notice/${notice._id}`}
                className="bg-blue-600 text-white font-semibold px-5 py-3 rounded hover:bg-red-600 hover:scale-105 transition w-max"
              >
                বিস্তারিত দেখুন
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105"
        >
          Next
        </button>
      </div>
    </div>
  );
}
