/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchNotices = async (page, setNotices, setTotalPages) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notices?page=${page}&limit=10`
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
    setNotices(data.notices);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching notices:", error);
  }
};

export default function NoticeControl() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);
  const [selectedImagePDF, setSelectedImagePDF] = useState(null);
  const [deleteMarkCard, setDeleteMarkCard] = useState(false);
  const [markDeleting, setMarkDeleting] = useState(false);
  const [deleteIDs, setDeleteIDs] = useState([]);

  const updateFileInputRef = useRef(null);
  const addFileInputRef = useRef(null);

  useEffect(() => {
    fetchNotices(page, setNotices, setTotalPages);
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

  const handleNoticeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleNoticeAdd = async (e) => {
    e.preventDefault();

    if (notices.length > 39) {
      setOverlayAlert(true);
      setAlertText("Notices add limit exceed, 40 notices are allowed");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    if (title.length > 80) {
      setOverlayAlert(true);
      setAlertText("Title length shouldn't excced 80 characters limit");
      setOPSuccess(false);
      return;
    }

    if (description.length > 300) {
      setOverlayAlert(true);
      setAlertText("Description length shouldn't excced 300 characters limit");
      setOPSuccess(false);
      return;
    }

    if (!file) {
      setOverlayAlert(true);
      setAlertText("No image selected");
      setOPSuccess(false);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/notice-add`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Notice added succesfully");
        setOPSuccess(true);
        setTitle("");
        setDescription("");
        if (addFileInputRef.current) addFileInputRef.current.value = "";
      } else {
        const errorData = await response.json();
        setOverlayAlert(true);
        setAlertText(`Error: ${errorData.error}`);
        setOPSuccess(false);
      }
    } catch (error) {
      setOverlayAlert(true);
      setAlertText("Error adding notice");
      setOPSuccess(false);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
      fetchNotices(page, setNotices, setTotalPages);
    }
  };

  const handleNoticeUpdate = async (e) => {
    e.preventDefault();

    if (newTitle.length > 80) {
      setOverlayAlert(true);
      setAlertText("Title length shouldn't excced 80 characters limit");
      setOPSuccess(false);
      return;
    }

    if (newDescription.length > 300) {
      setOverlayAlert(true);
      setAlertText("Description length shouldn't excced 300 characters limit");
      setOPSuccess(false);
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", newDescription);
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/update-notice/${selectedNotice._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Notice updated succesfully");
        setOPSuccess(true);
        setNewTitle("");
        setNewDescription("");
        if (updateFileInputRef.current) updateFileInputRef.current.value = "";
      } else {
        const errorData = await response.json();
        setOverlayAlert(true);
        setAlertText(`Error: ${errorData.error}`);
        setOPSuccess(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      setOverlayAlert(true);
      setAlertText("Error updating notice");
      setOPSuccess(false);
    } finally {
      setUpdating(false);
      fetchNotices(page, setNotices, setTotalPages);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-notice/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Notice deleted succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.error("delete error:", error);
      setOverlayAlert(true);
      setAlertText("Error deleting notice");
      setOPSuccess(false);
    } finally {
      fetchNotices(page, setNotices, setTotalPages);
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
      const response = await fetch(`${API_BASE_URL}/api/delete-notice-mark`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: deleteIDs.flat() }),
      });

      if (response.ok) {
        setDeleteMarkCard(false);
        setOverlayAlert(true);
        setAlertText("Notices deleted succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      console.error("delete error:", error);
      setOverlayAlert(true);
      setAlertText("Error deleting notices");
      setOPSuccess(false);
    } finally {
      fetchNotices(page, setNotices, setTotalPages);
      setMarkDeleting(false);
      setDeleteIDs([]);
    }
  };

  // Delete all headlines
  const handleDeleteHeadlines = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/all-headlines-delete`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("delete error:", error);
    }
  };

  // Make it Update Headline
  const handleAddUpdateHeadline = async (headline) => {
    handleDeleteHeadlines();

    console.log(headline);
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-headline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ headline }),
      });

      if (response.ok) {
        setOverlayAlert(true);
        setAlertText("Headline added succesfully");
        setOPSuccess(true);
      }
    } catch (error) {
      setOverlayAlert(true);
      setAlertText("Error adding Headline");
      setOPSuccess(false);
      console.log(error);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Notice Add and Update */}
      <div className="flex items-center justify-center space-x-10 mb-20">
        {/* Add New Notice */}
        <div className="grid grid-cols-1 gap-6 ">
          {/* Add a New Notice */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Add a New Notice
            </h2>
            <form onSubmit={handleNoticeAdd} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              {/* Drag & Drop File Upload */}
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleNoticeFile}
                  ref={addFileInputRef}
                  className="text-center"
                />
                <span className="text-gray-500">
                  Click to select an image/PDF
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {loading ? "Adding..." : "Add Notice"}
              </button>
            </form>
          </div>
        </div>

        {/* Update Notice */}
        <div className="grid grid-cols-1 gap-6 ">
          {/* Add a New Notice */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Update Notice (Please select a notice first)
            </h2>
            <form onSubmit={handleNoticeUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                type="text"
                placeholder="Enter description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300"
              />

              {/* Drag & Drop File Upload */}
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleNoticeFile}
                  ref={updateFileInputRef}
                  className="text-center"
                />
                <span className="text-gray-500">
                  Click to select an image/PDF
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !selectedNotice}
                className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
              >
                {updating ? "Updating..." : "Update Notice"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>File size limit upto 5 MB.</li>
          <li>You can use 'Mark' feature to delete more notices at once.</li>
          <li>
            You can update title only, description only, image only or all at
            once.
          </li>
          <li>Click on image preview to get full view.</li>
          <li>Title length should not exceed 80 characters.</li>
          <li>Description length should not excced 300 characters.</li>
          <li>
            'Make it Headline' button would let you make that particular notice
            as a headline in update bar for client.
          </li>
          <li>Max 40 notices are currently allowed.</li>
        </ul>
      </div>

      {/* Notice List */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 cursor-pointer">
        {notices.map((notice) => (
          <div
            key={notice._id}
            onClick={() =>
              setSelectedNotice(
                selectedNotice?._id === notice._id ? null : notice
              )
            }
            className={`p-8 border rounded-lg flex items-center justify-between transition relative cursor-pointer ${
              selectedNotice?._id === notice._id
                ? "border-blue-500 shadow-md"
                : "border-gray-300 hover:shadow"
            }`}
          >
            {/* Notices */}
            <div className="flex items-center justify-center cursor-pointer">
              {/* Mark Items */}
              <label className="relative flex items-center cursor-pointer mr-5">
                <input
                  onChange={(event) => {
                    handleCheckboxChange(event, notice._id);
                  }}
                  type="checkbox"
                  className="peer hidden"
                />
                <div className="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:border-red-500 peer-checked:bg-red-500 transition">
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

              {/* Image with Click Event */}
              <div>
                <div
                  className="relative group transition w-40"
                  onClick={() => setSelectedImagePDF(notice.fileUrl)}
                >
                  {notice.fileUrl?.endsWith(".pdf") ? (
                    <div className="h-40 w-40 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100 cursor-pointer hover:shadow transition">
                      <p className="text-center text-blue-600 font-semibold">
                        Click to View PDF
                      </p>
                    </div>
                  ) : (
                    <img
                      src={notice.fileUrl}
                      alt={notice.title}
                      className="h-40 w-40 object-cover rounded-md cursor-pointer"
                    />
                  )}

                  {/* Hover Overlay with Icon - Now only on Image */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                    <Eye className="text-white w-8 h-8" />
                  </div>
                </div>

                <p className="text-base font-semibold text-gray-500 mt-2.5">
                  Added on: {new Date(notice.createdAt).toLocaleDateString()}
                </p>
                <p className="text-base font-semibold text-gray-500">
                  Updated on: {new Date(notice.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Notice Text and Headline Btn */}
              <div className="ml-4">
                <h2 className="text-3xl font-semibold text-left justify-start text-gray-700 mb-3 cursor-pointer">
                  {notice.title}
                </h2>
                <p className="text-gray-700 text-left text-xl cursor-pointer mb-10">
                  {notice.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddUpdateHeadline(notice.title);
                  }}
                  className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 px-5 py-2 transition hover:scale-105 cursor-pointer"
                >
                  Make it Headline
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteID(notice._id);
                setDeleteNotice(true);
              }}
              className="bg-red-500 text-white font-semibold px-5 py-3 rounded-[8px] hover:bg-red-600 hover:scale-105 cursor-pointer ml-2.5"
            >
              Delete
            </button>
          </div>
        ))}
        {deleteNotice && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setDeleteNotice(false)}
          >
            <div className="bg-white px-8 py-6 rounded-md shadow-lg">
              <p className="text-black font-semibold text-xl text-center">
                Are you sure you want to delete this notice?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteNotice(false)}
                  className="bg-gray-300 text-black text-xl font-semibold px-4 py-1 rounded cursor-pointer hover:scale-105"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(deleteID)}
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
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-blue-500 text-white rounded-lg mr-5 hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white rounded-lg ml-5 hover:bg-blue-600 px-5 py-3 disabled:bg-gray-400 transition hover:scale-105 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Mark Delete Floating */}
      {deleteMarkCard && (
        <div className="fixed top-1/2 right-0 -translate-y-1/2 bg-white shadow-lg rounded-lg p-5 w-64 border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">Delete Items?</h3>
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
      )}

      {/* Image PDF Overlay Viewer */}
      {selectedImagePDF && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImagePDF(false)}
        >
          <div className="relative">
            {/* Close Button */}
            <button
              className="absolute top-0 -right-2 bg-red-600 text-white px-3 py-1 rounded-[4px] text-xl cursor-pointer"
              onClick={() => setSelectedImagePDF(false)}
            >
              ✕
            </button>

            {/* Render Image or PDF */}
            {selectedImagePDF.endsWith(".pdf") ? (
              <iframe
                src={selectedImagePDF}
                className="w-[80vw] h-[90vh] rounded-lg"
              ></iframe>
            ) : (
              <img
                src={selectedImagePDF}
                alt="Selected"
                className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
              />
            )}
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
