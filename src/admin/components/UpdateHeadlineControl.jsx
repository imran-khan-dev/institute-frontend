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
        console.log(data);
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
      }
    } catch (error) {
      console.error("Error deleting headline:", error);
    }
  };

  const handleAddUpdateHeadline = async (e) => {
    e.preventDefault();

    if (headline.length > 80) {
      setOverlayAlert(true);
      setAlertText("Headline length shouldn't excced 80 characters limit");
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
        setAlertText("Update Headline added succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      setOverlayAlert(true);
      setAlertText("Error adding Update Headline");
      setOPSuccess(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Headline Add */}
      <div className="flex items-center justify-center space-x-10 mb-20">
        {/* Add New Update Headline */}
        <div className="grid grid-cols-1 gap-6 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Add a Headline
            </h2>
            <form onSubmit={handleAddUpdateHeadline} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {loading ? "Adding..." : "Add Headline"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Headline length should not exceed 80 characters.</li>
          <li>Adding a new headline will delete the previous one.</li>
        </ul>
      </div>

      {/* Headline View */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 cursor-pointer">
        {headlines.map((headline) => (
          <div
            key={headline._id}
            className="p-8 border rounded-lg flex items-center justify-between transition relative cursor-pointer"
          >
            {/* Notice Text */}
            <div className="ml-4">
              <h2 className="text-3xl font-semibold text-left justify-start text-gray-700 mb-3 cursor-pointer">
                {headline.headline}
              </h2>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => {
                // e.stopPropagation();
                setDeleteHeadline(true);
              }}
              className="bg-red-500 text-white font-semibold px-5 py-3 rounded-[8px] hover:bg-red-600 hover:scale-105 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confrim Card */}
      {deleteHeadline && (
        <div
          className="fixed inset-0 flex justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setDeleteHeadline(false)}
        >
          <div className="bg-white px-8 py-6 rounded-md shadow-lg">
            <p className="text-black font-semibold text-xl text-center">
              Are you sure?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setDeleteHeadline(false)}
                className="bg-gray-300 text-black font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
              >
                No
              </button>
              <button
                onClick={() => handleDelete()}
                className="bg-red-500 text-white font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
              <img className="w-[150px]" src="/fail.gif" alt="fail" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
