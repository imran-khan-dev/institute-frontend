import { useEffect, useRef, useState } from "react";

function GoverningBodyControl() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [deleteCard, setDeleteCard] = useState(false);
  const [loading, setLoading] = useState({
    loading: false,
    sign: false,
    button: false,
    message: "",
  });
  const [cardShowDetail, setCardShowDetail] = useState({
    cardTitle: "",
    cardDescription: "",
  });

  const [overlayAlert, setOverlayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [opSuccess, setOPSuccess] = useState(false);

  const updateFileInputRef = useRef(null);
  const addFileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/governing-body-all`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        if (data.length > 0) {
          setSelectedMember(data[0]);
          setCardShowDetail({
            cardTitle: data[0].title,
            cardDescription: data[0].description,
          });
        }
      })
      .catch((err) =>
        console.error("Error fetching governing body members:", err)
      );
  }, []);

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const handleImageChange = (e) => setNewImage(e.target.files[0]);

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (members.length > 19) {
      setOverlayAlert(true);
      setAlertText("Members add limit exceed, 20 members are allowed");
      setOPSuccess(false);
      setLoading(false);
      return;
    }

    if (title.length > 40) {
      setOverlayAlert(true);
      setAlertText("Name length shouldn't excced 40 characters limit");
      setOPSuccess(false);
      return;
    }

    if (description.length > 300) {
      setOverlayAlert(true);
      setAlertText("Description length shouldn't excced 300 characters limit");
      setOPSuccess(false);
      return;
    }

    setLoading({
      loading: true,
      sign: true,
      button: false,
      message: "Member being added, please wait!",
    });
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/upload-governing-body`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setOverlayAlert(true);
        setAlertText(`Error: ${errorData.error}`);
        setOPSuccess(false);

        setLoading((prevState) => ({
          ...prevState,
          loading: false,
          sign: false,
          button: false,
          message: "",
        }));
      } else {
        const newMember = await response.json();
        setMembers((prevMembers) => [...prevMembers, newMember]);

        // Reseting input fields
        setTitle("");
        setDescription("");
        setImage(null);
        if (addFileInputRef.current) addFileInputRef.current.value = "";

        setLoading((prevState) => ({
          ...prevState,
          loading: true,
          sign: false,
          button: true,
          message: "Member added successfully!",
        }));
      }
    } catch (error) {
      console.error("Error adding member", error);
      setLoading((prevState) => ({
        ...prevState,
        loading: true,
        sign: false,
        button: true,
        message: "Adding member failed",
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMember) {
      alert("Please select a member to update.");
      return;
    }
    setLoading({
      loading: true,
      sign: true,
      button: false,
      message: "Member being updated, please wait!",
    });
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", newDescription);
    if (newImage) formData.append("image", newImage);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/governing-body-update/${selectedMember._id}`,
        { method: "PUT", body: formData }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setOverlayAlert(true);
        setAlertText(`Error: ${errorData.error}`);
        setOPSuccess(false);
        setLoading((prevState) => ({
          ...prevState,
          loading: false,
          sign: false,
          button: false,
          message: "",
        }));
      } else {
        const updatedMember = await response.json();
        setMembers((prev) =>
          prev.map((m) => (m._id === selectedMember._id ? updatedMember : m))
        );
        setCardShowDetail({
          cardTitle: updatedMember.title,
          cardDescription: updatedMember.description,
        });

        // Reset input fields after successful update
        setNewTitle("");
        setNewDescription("");
        setNewImage(null);
        if (updateFileInputRef.current) updateFileInputRef.current.value = "";

        setLoading((prevState) => ({
          ...prevState,
          loading: true,
          sign: false,
          button: true,
          message: "Member updated successfully!",
        }));
      }
    } catch (error) {
      console.error("Error updating member", error);
      setLoading((prevState) => ({
        ...prevState,
        loading: true,
        sign: false,
        button: true,
        message: "Updating member failed",
      }));
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) {
      alert("Please select a member to delete.");
      return;
    }
    setLoading({
      loading: true,
      sign: true,
      button: false,
      message: "Member being deleted, please wait!",
    });
    try {
      await fetch(
        `${API_BASE_URL}/api/governing-body-delete/${selectedMember._id}`,
        { method: "DELETE" }
      );
      setMembers((prev) => prev.filter((m) => m._id !== selectedMember._id));
      setDeleteCard(false);
      setLoading((prevState) => ({
        ...prevState,
        loading: true,
        sign: false,
        button: true,
        message: "Member deleted successfully!",
      }));
      setCardShowDetail({ cardTitle: "", cardDescription: "" });
    } catch (error) {
      console.error("Error deleting member", error);
      setLoading((prevState) => ({
        ...prevState,
        loading: true,
        sign: false,
        button: true,
        message: "Deleting member failed",
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 bg-gray-100 text-gray-900 shadow-xl rounded-3xl">
      {/* Loading Message */}

      {loading.loading && (
        <div
          className="fixed inset-0 flex justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setLoading({ loading: false })}
        >
          <div className="bg-white w-[300px] h-[115px] p-4 rounded-md shadow-lg">
            <p className="text-black text-center">{loading.message}</p>
            <div className="flex justify-center gap-4 mt-4">
              {loading.sign && (
                <div>
                  <img
                    className="w-[50px] h-auto"
                    src="/Loading_2.gif"
                    alt="loading"
                  />
                </div>
              )}
              {loading.button && (
                <div>
                  <button
                    onClick={() => setLoading({ loading: false })}
                    className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer"
                  >
                    Okay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10 p-3 md:p-0">
        {members.map((member) => (
          <div
            key={member._id}
            className={`p-3 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedMember?._id === member._id
                ? "border-2 border-blue-500"
                : "border border-gray-300"
            }`}
            onClick={() => {
              setSelectedMember(member);
              setCardShowDetail({
                cardTitle: member.title,
                cardDescription: member.description,
              });
            }}
          >
            <img
              src={member.imageUrl}
              alt={member.title}
              className="w-[200px] h-[200px] object-cover rounded-lg"
            />
            <h4 className="mt-4 text-lg font-semibold">{member.title}</h4>
          </div>
        ))}
      </div>

      {/* Selected Member Details Show */}
      {cardShowDetail.cardTitle && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="flex flex-col items-start justify-center mb-3">
            <h2 className="text-xl font-bold mb-3">
              {cardShowDetail.cardTitle}
            </h2>
            <p className="text-gray-700 mb-3">
              {cardShowDetail.cardDescription}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Name length is limit to 40 characters.</li>
          <li>Description length is limit to 300 characters.</li>
          <li>
            You can update name only, description only, image only or all at
            once.
          </li>
          <li>Max 20 members are currently allowed.</li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-5 md:mb-7 px-2 md:px-4">
        {/* Add New Member Section */}
        <div className="w-full md:w-1/2 mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center mb-5">
            Add New Member
          </h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <input
              type="text"
              value={title}
              placeholder="Enter Name"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
            <textarea
              value={description}
              placeholder="Enter Description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
            <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
              <input
                type="file"
                ref={addFileInputRef}
                accept="image/*"
                onChange={handleAddImage}
                className="text-center text-xs md:text-base"
                required
              />
            </label>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium hover:scale-105"
            >
              Add Member
            </button>
          </form>
        </div>

        {/* Update Member Section */}
        {selectedMember && (
          <div className="w-full md:w-1/2 md:mt-10 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center mb-5">
              Update Member
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <textarea
                value={newDescription}
                placeholder="Enter Description"
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <input
                  type="file"
                  ref={updateFileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-center text-xs md:text-base"
                />
              </label>
              <div className="flex items-center justify-start">
                <button
                  type="submit"
                  className="cursor-pointer w-auto px-5 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium hover:scale-105"
                >
                  Update Member
                </button>
              </div>
            </form>

            {/* Delete Confirmation Modal */}
            {deleteCard && (
              <div
                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
                onClick={() => setDeleteCard(false)}
              >
                <div
                  className="bg-white px-6 py-5 rounded-md shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-black text-center">Are you sure?</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => setDeleteCard(false)}
                      className="bg-gray-300 text-black px-4 py-1 rounded cursor-pointer"
                    >
                      No
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer hover:scale-105"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setDeleteCard(true)}
          className="cursor-pointer w-auto px-5 py-2 mt-3 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium hover:scale-105"
        >
          Delete Member
        </button>
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

export default GoverningBodyControl;
