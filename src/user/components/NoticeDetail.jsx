import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNotice = async () => {
      const res = await fetch(`${API_BASE_URL}/api/notice/${id}`);
      const data = await res.json();
      console.log(data);
      setNotice(data);
    };

    fetchNotice();
  }, [id]);

  useEffect(() => {
    if (notice?.title) {
      document.title = `${notice.title} | এক্স ওয়াই জেড বিদ্যালয়`;
    }
  }, [notice]);

  if (!notice) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-white shadow rounded-lg mt-10">
      <Link
        to="/"
        className="bg-blue-600 text-white font-semibold px-5 py-3 rounded hover:bg-red-600 hover:scale-105 transition w-max"
      >
        Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mt-10">{notice.title}</h1>
      <p className="text-gray-700 text-lg">{notice.description}</p>
      {notice.fileUrl?.endsWith(".pdf") ? (
        <iframe
          src={notice.fileUrl}
          className="w-full h-[600px] border mt-4"
        ></iframe>
      ) : (
        <img
          src={notice.fileUrl}
          alt="Notice File"
          className="w-full mt-4 rounded"
        />
      )}
    </div>
  );
};

export default NoticeDetail;
