import { useState, useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchImages = async (page, setTotalPages, setImages) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/all-images?page=${page}&limit=5`
    );
    const data = await response.json();
    setImages(data.images);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

export default function MediaGalleryControl() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadingImages, setUploadingImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [clickedImageView, setClickedImageView] = useState(null);

  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteMarkCard, setDeleteMarkCard] = useState(false);
  const [markDeleting, setMarkDeleting] = useState(false);
  const [deleteIDs, setDeleteIDs] = useState([]);

  const addImageInputRef = useRef(null);

  useEffect(() => {
    fetchImages(page, setTotalPages, setImages);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePhotoFile = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setUploadingImages(selectedFiles);
    }
  };

  const handleImageAdd = async (e) => {
    e.preventDefault();

    if (!uploadingImages || uploadingImages.length === 0) {
      setOverlayAlert(true);
      setAlertText("No image selected!");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < uploadingImages.length; i++) {
      formData.append("images", uploadingImages[i]);
    }

    if (uploadingImages.length === 0) {
      setOverlayAlert(true);
      setAlertText("No image selected!");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/add-image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Image uploaded successfully");
        if (addImageInputRef.current) addImageInputRef.current.value = "";
        setUploadingImages(null);
        setOverlayAlert(true);
        setAlertText("Image uploaded successfully");
        setOPSuccess(true);
      } else {
        const errorData = await response.json();
        console.log("Upload failed:", errorData);
        setOverlayAlert(true);
        setAlertText(`Error: ${errorData.error}`);
        setOPSuccess(false);
      }
    } catch (error) {
      console.log("Error uploading images", error);
      setOverlayAlert(true);
      setAlertText("Error uploading images");
      setOPSuccess(false);
    } finally {
      setLoading(false);
      fetchImages(page, setTotalPages, setImages);
    }
  };

  const handleImageMetaUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/update-image-meta/${selectedImage._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, altText: altText }),
        }
      );

      if (response.ok) {
        console.log("Image meta updated succesfully");
        setOverlayAlert(true);
        setAlertText("Images meta updated succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.log("Error updating image meta", error);
      setOverlayAlert(true);
      setAlertText("Error updating image meta");
      setOPSuccess(false);
    } finally {
      fetchImages(page, setTotalPages, setImages);
      setUpdating(false);
    }
  };

  const handleImageDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-image/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Image deleted succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.error("delete error:", error);
      setOverlayAlert(true);
      setAlertText("Error deleting image");
      setOPSuccess(false);
    } finally {
      fetchImages(page, setTotalPages, setImages);
    }
  };

  // Handle Mark
  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setDeleteIDs((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      if (deleteIDs.length > 0) {
        setDeleteMarkCard(true);
      }
    } else {
      setDeleteIDs((prev) => prev.filter((item) => item !== id));
      if (deleteIDs.length <= 2) {
        setDeleteMarkCard(false);
      }
    }
  };

  const handleMarkDelete = async () => {
    setMarkDeleting(true);
    if (deleteIDs.length === 0) {
      console.error("No IDs selected for deletion.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-mark-images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: deleteIDs.flat() }),
      });

      if (response.ok) {
        setDeleteMarkCard(false);
        setOverlayAlert(true);
        setAlertText("Images deleted succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.error("delete error:", error);
      setOverlayAlert(true);
      setAlertText("Error deleting images");
      setOPSuccess(false);
    } finally {
      fetchImages(page, setTotalPages, setImages);
      setDeleteIDs([]);
      setMarkDeleting(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Image Add to Gallery and Update */}
      <div className="flex items-center justify-center space-x-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 ">
          {/* Add a New Image */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Add New Photo
            </h2>
            <form onSubmit={handleImageAdd} className="space-y-4">
              {/* Drag & Drop File Upload */}
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoFile}
                  ref={addImageInputRef}
                  className="text-center"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Update Image Meta */}
          <div className="grid grid-cols-1 gap-6 ">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                Update Image Details (Please select a image first)
              </h2>
              <form onSubmit={handleImageMetaUpdate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
                />

                <input
                  type="text"
                  placeholder="Enter Alternative Text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
                />

                <button
                  type="submit"
                  disabled={loading || !selectedImage}
                  className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
                >
                  {updating ? "Updating..." : "Update Details"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            onClick={() =>
              setSelectedImage(selectedImage?._id === image._id ? null : image)
            }
            className={`p-4 border rounded-lg flex items-center justify-center transition relative cursor-pointer ${
              selectedImage?._id === image._id
                ? "border-blue-500 shadow-md"
                : "border-gray-300 hover:shadow"
            }`}
          >
            {/* Mark Items */}
            <label className="absolute bottom-2 left-2 flex items-center cursor-pointer">
              <input
                onChange={(event) => {
                  handleCheckboxChange(event, image._id);
                }}
                type="checkbox"
                className="peer hidden"
              />
              <div className="w-4 h-4 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:border-white peer-checked:bg-blue-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 11l3 3L22 4l-2-2-9 9-3-3-2 2z" />
                </svg>
              </div>
            </label>

            {/* Photos */}
            <div className="flex flex-col items-center justify-center cursor-pointer">
              {/* Image with Click Event */}
              <img
                src={image.url}
                alt={image.altText || "Gallery Image"}
                className="w-full h-40 object-cover rounded-md"
                onClick={() => {
                  setSelectedImage(
                    selectedImage?._id === image._id ? null : image
                  );
                  setClickedImageView(image.url);
                }}
              />
              {/* Title */}
              <h3 className="mt-2 text-center text-sm font-medium text-gray-700">
                {image.title || "Untitled"}
              </h3>
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteImage(true);
                  setDeleteID(image._id);
                }}
                className="absolute bottom-0 right-1 text-black hover:text-red-600 p-2 cursor-pointer opacity-25 hover:opacity-100 transition-opacity duration-300"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {deleteImage && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
            onClick={() => setDeleteImage(false)}
          >
            <div className="bg-white px-8 py-6 rounded-md shadow-lg">
              <p className="text-black font-semibold text-xl text-center">
                Are you sure you want to delete this media?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteImage(false)}
                  className="bg-gray-300 text-black text-xl font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
                >
                  No
                </button>
                <button
                  onClick={() => handleImageDelete(deleteID)}
                  className="bg-red-500 text-white text-xl font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10 text-center">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-blue-500 text-white rounded-lg px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white rounded-lg px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Mark Delete Floating */}
      {deleteMarkCard && (
        <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
          <div className="bg-white px-6 py-4 sm:px-8 sm:py-6 rounded-md shadow-lg max-w-[90vw] w-64 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Items?
            </h3>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDeleteMarkCard(false)}
                className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 cursor-pointer rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => handleMarkDelete()}
                className="bg-red-500 text-white font-semibold px-6 py-2 cursor-pointer rounded-md hover:bg-red-600"
              >
                {markDeleting ? "Deleting" : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Alert */}
      {overlayAlert && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
          onClick={() => setOverlayAlert(false)}
        >
          <div className="bg-white px-6 py-4 sm:px-8 sm:py-6 rounded-md shadow-lg max-w-[90vw] flex items-center gap-4 cursor-default">
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

      {/* Image Overlay Viewer */}
      {clickedImageView && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setClickedImageView(false)}
        >
          <div className="relative bg-white px-6 py-4 sm:px-8 sm:py-6 rounded-md shadow-lg max-w-[95vw]">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-xl cursor-pointer"
              onClick={() => setClickedImageView(false)}
            >
              ✕
            </button>

            <img
              src={clickedImageView}
              alt="Selected"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
