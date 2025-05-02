import { useState, useEffect } from "react";

export default function SliderControl() {
  const [slider, setSlider] = useState([]);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewAddSlide, setPreviewAddSlide] = useState(null);
  const [previewUpdateSlide, setPreviewUpdateSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [deleteSlider, setDeleteSlider] = useState(false);

  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = () => {
    fetch(`${API_BASE_URL}/api/slider-images`)
      .then((res) => res.json())
      .then((data) => {
        setSlider(data);
        if (data.length > 0) {
          setSelectedSlider(data[0]);
        }
      })
      .catch((err) => console.error("Error fetching sliders:", err));
  };

  // Handle File Selection
  const handleFileAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewAddSlide(URL.createObjectURL(file));
    }
  };

  const handleFileUpdate = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreviewUpdateSlide(URL.createObjectURL(file));
  };

  // Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (slider.length >= 3) {
      setOverlayAlert(true);
      setAlertText("Slider limit exceed, please delete one to add new");
      setOPSuccess(false);
      return;
    }

    if (!title) {
      setOverlayAlert(true);
      setAlertText("Title is required!");
      setOPSuccess(false);
      return;
    }

    if (!image) {
      setOverlayAlert(true);
      setAlertText("Image is required!");
      setOPSuccess(false);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/api/slider-upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setImage(null);
        setPreviewAddSlide(null);
        setOverlayAlert(true);
        setAlertText("Slider uploaded successfully!");
        setOPSuccess(true);
      }
    } catch (error) {
      setOverlayAlert(true);
      setAlertText("Error uploading slider!");
      setOPSuccess(false);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      fetchSliders();
    }
  };

  // Hanlde Delete
  const handleDelete = async () => {
    if (!selectedSlider) {
      setOverlayAlert(true);
      setAlertText("Please select a slide to delete");
      setOPSuccess(false);
      return;
    }

    setDeleting(true);

    try {
      await fetch(`${API_BASE_URL}/api/slider-delete/${selectedSlider._id}`, {
        method: "DELETE",
      });
      setSlider((prev) => prev.filter((m) => m._id !== selectedSlider._id));
      setDeleting(false);
      setOverlayAlert(true);
      setAlertText("Slider deleted successfully!");
      setOPSuccess(true);
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider", error);
      setOverlayAlert(true);
      setAlertText("Error deleting slider!");
      setOPSuccess(false);
    } finally {
      setDeleting(false);
      fetchSliders();
    }
  };

  // Hanlde Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSlider) {
      setOverlayAlert(true);
      setAlertText("Please select a slide to update");
      setOPSuccess(false);
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    if (newTitle) formData.append("title", newTitle);
    console.log("check 2");
    if (newImage) formData.append("image", newImage);
    console.log("check 3");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/slider-update/${selectedSlider._id}`,
        { method: "PUT", body: formData }
      );
      console.log("check 4");
      if (!response.ok) {
        setUpdating(false);
      } else {
        const updatedSlide = await response.json();
        setSlider((prev) =>
          prev.map((s) => (s._id === selectedSlider._id ? updatedSlide : s))
        );
        setSelectedSlider(updatedSlide);
        setUpdating(true);
        setNewTitle("");
        setOverlayAlert(true);
        setAlertText("Slider updated successfully!");
        setOPSuccess(true);
        setPreviewUpdateSlide(null);
      }
    } catch (error) {
      console.error("Error updating member", error);
      setUpdating(false);
      setOverlayAlert(true);
      setAlertText("Updating slider failed");
      setOPSuccess(false);
    } finally {
      setUpdating(false);
      // fetchSliders();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Max 3 slides are allowed.</li>
          <li>
            To add new slide, first delete any single slide of the current three
            slides.
          </li>
          <li>You can update title only, image only or both at once.</li>
        </ul>
      </div>

      {/* Selected Slider Preview */}
      {selectedSlider && (
        <div className="bg-white p-5 rounded-lg shadow-lg text-center">
          <h2 className="text-4xl font-semibold text-gray-700">
            {selectedSlider.title}
          </h2>
          <img
            src={selectedSlider.imageUrl}
            alt={selectedSlider.title}
            className="w-full max-w-lg mx-auto rounded-lg shadow-md mt-3"
          />
          <p className="mt-2 text-gray-600">{selectedSlider.description}</p>
        </div>
      )}

      {/* Slider List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {slider.map((item) => (
          <button
            key={item._id}
            onClick={() => setSelectedSlider(item)}
            className={`p-2 border rounded-lg flex items-center justify-center transition cursor-pointer ${
              selectedSlider?._id === item._id
                ? "border-blue-500 shadow-md"
                : "border-gray-300 hover:shadow"
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-20 w-32 object-cover rounded-md"
            />
          </button>
        ))}
      </div>

      {/* Upload & Update Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload New Slider */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Upload New Slider
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              required
            />

            {/* Drag & Drop File Upload */}
            <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileAdd}
                className="hidden"
              />
              <span className="text-gray-500">Click to select an image</span>
            </label>

            {previewAddSlide && (
              <div className="relative">
                <img
                  src={previewAddSlide}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
            >
              {uploading ? "Uploading..." : "Upload Slider"}
            </button>
          </form>
        </div>

        {/* Update Slider */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Update Slider
          </h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
            />

            {/* Drag & Drop File Upload */}
            <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
              <input
                type="file"
                onChange={handleFileUpdate}
                className="hidden"
              />
              <span className="text-gray-500">Click to select an image</span>
            </label>

            {previewUpdateSlide && (
              <div className="relative">
                <img
                  src={previewUpdateSlide}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full px-5 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium transition transform hover:scale-105 cursor-pointer"
            >
              {updating ? "Updating Slider..." : "Update Slider"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Button with Confirmation */}
      <div className="flex justify-center">
        <button
          className="w-auto bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition transform hover:scale-105 cursor-pointer"
          disabled={deleting}
          onClick={() => setDeleteSlider(true)}
        >
          {deleting ? "Deleting..." : "Delete Slider"}
        </button>

        {/* Delete Confirmation Modal */}
        {deleteSlider && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setDeleteSlider(false)}
          >
            <div className="bg-white p-7 rounded-md shadow-lg">
              <p className="text-black text-xl font-semibold text-center">
                Are you sure you want to delete this slider?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteSlider(false)}
                  className="bg-gray-300 text-black text-xl font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
                >
                  No
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white text-xl font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
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
              <img className="w-[150px]" src="/fail.gif" alt="fail" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
