import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function AllNoticesView({ apiBaseUrl }) {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async (
    page,
    setNotices,
    setTotalPages,
    setIsLoading
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/notices?page=${page}&limit=10`
      );
      const data = await response.json();
      setNotices(data.notices);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(page, setNotices, setTotalPages, setIsLoading);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex-1 space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <h2 className="text-3xl font-bold mb-4 text-center">সকল নোটিশ সূমহ</h2>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-8 border rounded-lg shadow-md animate-pulse space-y-4"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-10 bg-gray-300 rounded w-32 mt-2" />
              </div>
            ))
          : notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white p-8 border rounded-lg flex items-center justify-between transition relative shadow-md"
              >
                <div className="flex flex-col">
                  <h2 className="text-3xl font-semibold text-gray-700 mb-3">
                    {notice.title}
                  </h2>
                  <p className="text-gray-700 text-xl mb-4">
                    {notice.description}
                  </p>
                  <Link
                    to={`/notice/${notice._id}`}
                    className="bg-green-700 text-white font-semibold px-5 py-3 rounded hover:bg-green-600 hover:scale-105 transition w-max"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="flex items-center gap-2 bg-green-700 text-white rounded-lg px-5 py-3 hover:bg-green-800 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            আগের
          </button>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="flex items-center gap-2 bg-green-700 text-white rounded-lg px-5 py-3 hover:bg-green-800 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            পরের
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

AllNoticesView.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};
