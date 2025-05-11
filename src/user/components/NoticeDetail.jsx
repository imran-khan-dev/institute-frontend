import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const NoticeDetail = ({ apiBaseUrl }) => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/notice/${id}`);
        const data = await res.json();
        setNotice(data);
      } catch (error) {
        console.error("Failed to fetch notice:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  return (
    <div className="flex-1 space-y-10">
      {isLoading ? (
        <div className="mt-10 space-y-6 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-[400px] bg-gray-200 rounded mt-6" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mt-10">
            {notice.title}
          </h1>
          <p className="text-gray-700 text-lg">{notice.description}</p>
          {notice.fileUrl?.endsWith(".pdf") ? (
            <iframe
              src={notice.fileUrl}
              className="w-full h-[600px] border mt-4"
              title="Notice PDF"
            ></iframe>
          ) : (
            <img
              src={notice.fileUrl}
              alt="Notice File"
              className="w-full mt-4 rounded"
            />
          )}
        </>
      )}
    </div>
  );
};

NoticeDetail.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default NoticeDetail;
