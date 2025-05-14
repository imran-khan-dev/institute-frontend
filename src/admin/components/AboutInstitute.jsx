import { useState } from "react";

export default function AboutSchool() {
  const [loading, setLoading] = useState(false);
  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleDeleteAbout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-about`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Previous About Details deleted");
      }
    } catch (error) {
      console.error("Error deleting About details:", error);
    }
  };

  const handleAddAbout = async (e) => {
    e.preventDefault();
    setLoading(true);
    handleDeleteAbout();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    console.log(formData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/add-about-institute`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Institute About added");
        setOverlayAlert(true);
        setAlertText("Institute About added");
        setOPSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setOverlayAlert(true);
      setAlertText("Error adding Institute About details");
      setOPSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-10">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Adding new will delete previous data, so in order to delete current
            data add new updated data.
          </li>
        </ul>
      </div>

      {/* Add About */}
      <div className="flex items-center justify-center space-x-10">
        {/* About form */}
        <div className="grid grid-cols-1 gap-6 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              About Institute
            </h2>
            <form onSubmit={handleAddAbout} className="space-y-4">
              <input
                type="text"
                placeholder="Enter institute title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />
              <textarea
                type="text"
                placeholder="Enter Institue description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {loading ? "Adding..." : "Add About"}
              </button>
            </form>
          </div>
        </div>
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
              <img className="w-[150px]" src="/fail.gif" alt="fail" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
