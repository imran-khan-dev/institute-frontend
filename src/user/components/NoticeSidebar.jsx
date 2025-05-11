import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function NoticeSidebar({ apiBaseUrl }) {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/notices?page=1&limit=10`);
      const data = await response.json();
      setNotices(data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">নোটিশ সূমহ</h2>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-4 rounded shadow animate-pulse h-16"
            >
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))
        ) : (
          <>
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-gray-50 p-4 rounded shadow flex justify-between items-center space-x-1.5"
              >
                <h2 className="text-base font-semibold text-gray-800">
                  {notice.title}
                </h2>
                <Link
                  to={`/notice/${notice._id}`}
                  className="text-[#057957] font-semibold hover:text-green-600 hover:underline text-sm"
                >
                  বিস্তারিত
                </Link>
              </div>
            ))}
            <Link
              to="/all-notices-view"
              className="block text-center bg-[#057957] text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
              সব নোটিশ দেখুন
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

NoticeSidebar.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default NoticeSidebar;
