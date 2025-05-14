import { useState, useEffect } from "react";

export default function LinkManager() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLink, setDeleteLink] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchALLLinks();
  }, []);

  const fetchALLLinks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-links`);
      const data = await res.json();
      setLinks(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (links.length > 9) {
      setOverlayAlert(true);
      setAlertText("Links add limit exceed, 10 links are allowed");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    if (!title) {
      setOverlayAlert(true);
      setAlertText("Title is requried");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    if (!url) {
      setOverlayAlert(true);
      setAlertText("URL is requried");
      setOPSuccess(false);
      setLoading(false);
      return false;
    }

    if (
      (!url.startsWith("http") && !url.startsWith("https")) ||
      !/\.(com|org|net|edu|gov|info|co|ac|com\.bd|org\.bd|net\.bd|gov\.bd|edu\.bd|ac\.bd)(\/|$)/i.test(
        url
      )
    ) {
      setOverlayAlert(true);
      setAlertText(
        "Invalid link format! Please include a valid domain (e.g., .com, .org, .gov.bd) and https."
      );
      setOPSuccess(false);
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/add-link`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title, url }),
      });

      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Link added succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      setOverlayAlert(true);
      setAlertText("Error adding link");
      setOPSuccess(false);
      console.log(error);
    } finally {
      setLoading(false);
      fetchALLLinks();
    }
  };

  const handleDelete = async () => {
    if (!deleteID) {
      console.log("Delete ID is null");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delete-link/${deleteID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Link deleted succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.error("delete error:", error);
      setOverlayAlert(true);
      setAlertText("Error deleting link");
      setOPSuccess(false);
    } finally {
      setDeleteLink(false);
      setDeleteID(null);
      await fetchALLLinks();
    }
  };

  return (
    <div className="p-3 md:p-6 mx-auto space-y-8">
      {/* Link Add */}
      <div className="flex items-center justify-center space-x-10 mb-10 md:mb-20">
        {/* Add New Link */}
        <div className="grid grid-cols-1 gap-6 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Add a Link
            </h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="text"
                placeholder="Enter Link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {loading ? "Adding..." : "Add Link"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-10">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Max 10 links are currently allowed.</li>
          <li>Link must start with https or http.</li>
        </ul>
      </div>

      {/* Active Link Status */}
      <p className="font-bold text-2xl ml-2 mb-5">
        Total Active Links: {links.length}
      </p>
      {/* Link List */}
      <div className="grid grid-cols-1 gap-6">
        {links
          .slice()
          .reverse()
          .map((link) => (
            <div
              key={link._id}
              className="p-4 sm:p-6 lg:p-8 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition relative"
            >
              {/* Link Details */}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mb-3">
                  {link.title}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-[160px] md:w-auto px-2 py-1 sm:py-2 bg-blue-500 text-white font-semibold rounded-[4px]">
                    Click Link to Visit:
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 text-base sm:text-lg break-all"
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteID(link._id);
                  setDeleteLink(true);
                }}
                className="bg-red-500 text-white font-semibold px-4 py-1 md:py-3 rounded-[4px] hover:bg-red-600 hover:scale-105 cursor-pointer self-start sm:self-center"
              >
                Delete
              </button>
            </div>
          ))}

        {/* Delete Modal */}
        {deleteLink && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            onClick={() => setDeleteLink(false)}
          >
            <div className="bg-white px-6 py-4 sm:px-8 sm:py-6 rounded-md shadow-lg max-w-[90vw]">
              <p className="text-black font-semibold text-xl text-center">
                Are you sure?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteLink(false)}
                  className="bg-gray-300 text-black font-semibold px-4 py-2 rounded hover:scale-105"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(deleteID)}
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:scale-105"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay Alert */}
      {overlayAlert && (
        <div
          className="fixed inset-0 flex justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setOverlayAlert(false)}
        >
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-md shadow-lg">
            <p className="text-black font-semibold text-xl text-center">
              {alertText}
            </p>
            {opSuccess ? (
              <img className="w-[150px]" src="/success-new.gif" alt="success" />
            ) : (
              <img className="w-[150px]" src="/fail.gif" alt="success" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
