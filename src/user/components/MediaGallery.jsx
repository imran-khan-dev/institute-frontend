import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const MediaGallery = ({ apiBaseUrl }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryTotalPages, setGalleryTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 🔹 New state

  useEffect(() => {
    fetchImages(galleryPage);
  }, [galleryPage]);

  const fetchImages = async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiBaseUrl}/api/all-images?page=${page}&limit=6`
      );
      const data = await response.json();
      setGalleryImages(data.images);
      setGalleryTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const showNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const showPrevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">মিডিয়া গ্যালারী</h2>

      {isLoading ? (
        <p className="text-center text-gray-500 animate-pulse">লোড হচ্ছে...</p>
      ) : galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={img._id}
              onClick={() => openModal(index)}
              className="relative cursor-pointer group rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent px-4 py-2">
                <h3 className="text-white font-semibold text-base mt-5 group-hover:underline">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No images available.</p>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setGalleryPage((prev) => Math.max(1, prev - 1))}
            disabled={galleryPage === 1}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-600 transition-colors duration-200 font-medium cursor-pointer text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            আগের
          </button>

          <button
            onClick={() =>
              setGalleryPage((prev) =>
                prev < galleryTotalPages ? prev + 1 : prev
              )
            }
            disabled={galleryPage === galleryTotalPages}
            className="flex items-center gap-1 bg-green-700 hover:bg-green-600 transition-colors duration-200 font-medium cursor-pointer text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            পরের
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Full View Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="absolute top-6 right-6 text-white text-2xl font-bold cursor-pointer z-50"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrevImage();
            }}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-3xl cursor-pointer hover:text-green-400 z-50"
          >
            ❮
          </button>

          <div
            className="max-w-3xl max-h-[80vh] overflow-hidden px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[currentImageIndex].url}
              alt=""
              className="w-full h-full object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg font-semibold">
              {galleryImages[currentImageIndex].title}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-3xl cursor-pointer hover:text-green-400 z-50"
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
};

MediaGallery.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default MediaGallery;
