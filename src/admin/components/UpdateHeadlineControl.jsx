import { useState, useEffect } from "react";

export default function UpdateHeadlineControl() {
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(null);
  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);
  const [headlines, setHeadlines] = useState([]);
  const [deleteHeadline, setDeleteHeadline] = useState();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = () => {
    fetch(`${API_BASE_URL}/api/all-headlines`)
      .then((res) => res.json())
      .then((data) => {
        setHeadlines(data);
      })
      .catch((err) => console.error("Error fetching headlines:", err));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all-headlines-delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchHeadlines();
        setDeleteHeadline(false);
      }
    } catch (error) {
      console.error("Error deleting headline:", error);
    }
  };

  const handleAddUpdateHeadline = async (e) => {
    e.preventDefault();

    if (headline.length > 80) {
      setOverlayAlert(true);
      setAlertText("Headline length shouldn't exceed 80 characters limit");
      setOPSuccess(false);
      return;
    }

    handleDelete();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/update-headline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ headline }),
      });

      if (response.ok) {
        fetchHeadlines();
        setOverlayAlert(true);
        setAlertText("Update Headline added successfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setOverlayAlert(true);
      setAlertText("Error adding Update Headline");
      setOPSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 mx-auto space-y-8 max-w-4xl">
      {/* Headline Add */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-10">
        <div className="w-full">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
              Add a Headline
            </h2>
            <form onSubmit={handleAddUpdateHeadline} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300 text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105"
              >
                {loading ? "Adding..." : "Add Headline"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
          <li>Headline length should not exceed 80 characters.</li>
          <li>Adding a new headline will delete the previous one.</li>
        </ul>
      </div>

      {/* Headline View */}
      <div className="grid grid-cols-1 gap-4">
        {headlines.map((headline) => (
          <div
            key={headline._id}
            className="p-6 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              {headline.headline}
            </h2>
            <button
              onClick={() => setDeleteHeadline(true)}
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 hover:scale-105"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteHeadline && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setDeleteHeadline(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto p-6 rounded-md shadow-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-black font-semibold text-center text-lg">
              Are you sure you want to delete?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteHeadline(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:scale-105"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:scale-105"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {overlayAlert && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setOverlayAlert(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto p-6 rounded-md shadow-lg space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-black font-semibold text-lg">{alertText}</p>
            <img
              className="mx-auto w-28 sm:w-36"
              src={opSuccess ? "/success-new.gif" : "/fail.gif"}
              alt={opSuccess ? "Success" : "Failed"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
