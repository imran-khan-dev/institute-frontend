import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [members, setMembers] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [links, setLinks] = useState([]);
  const [aboutInstitute, setAboutInstitute] = useState([]);
  const [instituteCode, setInstituteCode] = useState([]);
  const [notices, setNotices] = useState([]);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryTotalPages, setGalleryTotalPages] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchGoverningBody();
    fetchHeadlines();
    fetchSliders();
    fetchALLLinks();
    fetchAboutInstitute();
    fetchInstituteCode();
    fetchNotices();
  }, []);

  useEffect(() => {
    fetchImages(galleryPage, setGalleryTotalPages, setGalleryImages);
  }, [galleryPage]);

  useEffect(() => {
    document.title = "এক্স ওয়াই জেড বিদ্যালয়";
  }, []);

  const fetchGoverningBody = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/governing-body-all`);
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching governing body members:", err);
    }
  };

  const fetchHeadlines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all-headlines`);
      const data = await response.json();
      setHeadlines(data);
    } catch (err) {
      console.error("Error fetching headlines:", err);
    }
  };

  const fetchSliders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/slider-images`);
      const data = await response.json();
      setSliders(data);
    } catch (err) {
      console.error("Error fetching sliders:", err);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

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

  const goToNextGalleryPage = () => {
    if (galleryPage < galleryTotalPages) {
      setGalleryPage((prev) => prev + 1);
    }
  };

  const goToPrevGalleryPage = () => {
    if (galleryPage > 1) {
      setGalleryPage((prev) => prev - 1);
    }
  };

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

  const fetchAboutInstitute = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-about-institute`);
      const data = await res.json();
      setAboutInstitute(data[0]);
      console.log(data[0]);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
  };

  const fetchInstituteCode = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-institute-code`);
      const data = await res.json();
      setInstituteCode(data[0]);
      console.log(data[0]);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notices?page=${1}&limit=10`
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      setNotices(data.notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 mb-12 px-4">
      {/* Institute Code */}
      <div className="flex items-center justify-items-start space-x-1.5 mb-2">
        <div className="font-semibold text-gray-600">
          EIIN No: <span className="font-bold">{instituteCode.eIINNum}</span>
        </div>
        <div className="font-semibold text-gray-600">
          School Code:{" "}
          <span className="font-bold">{instituteCode.instituteCode}</span>
        </div>
        <div className="font-semibold text-gray-600">
          Reg No: <span className="font-bold">{instituteCode.regNum}</span>
        </div>
      </div>
      {/* Slider Section */}
      {sliders.length > 0 && (
        <section className="relative w-full h-80 overflow-hidden rounded-lg shadow-lg mb-16">
          <img
            src={sliders[currentSlide].imageUrl}
            alt={sliders[currentSlide].title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold">
              {sliders[currentSlide].title}
            </h2>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 cursor-pointer"
          >
            ▶
          </button>
        </section>
      )}

      {/* Headlines Ticker */}
      <div className="overflow-hidden bg-gray-100 py-2 mb-16">
        <div className="flex w-max animate-marquee whitespace-nowrap items-center">
          <span className="text-xl font-bold mr-8 text-red-600">আপডেট:</span>
          {headlines.map((headline, index) => (
            <marquee
              key={index}
              className="text-lg font-medium mr-12 text-gray-800"
            >
              {headline.headline}
            </marquee>
          ))}
        </div>
      </div>

      {/* Main Flex Container: Content on left, Links on right */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Content */}
        <div className="flex-1">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              প্রতিষ্ঠান সম্পর্কে
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {aboutInstitute.description}
            </p>
          </section>

          {/* Governing Body Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              স্কুল পরিচালকদের বাণী
            </h2>
            {members.length > 0 ? (
              <div className="flex flex-wrap justify-items-start gap-6">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="w-64 bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition"
                  >
                    <img
                      src={member.imageUrl}
                      alt={member.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="mt-3 text-xl font-semibold text-gray-800">
                      {member.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No governing body members available.
              </p>
            )}
          </section>

          {/* Media Gallery Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              মিডিয়া গ্যালারী
            </h2>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryImages.map((img) => (
                  <div
                    key={img._id}
                    className="w-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{img.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {img.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No images available.</p>
            )}

            {/* Pagination Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={goToPrevGalleryPage}
                disabled={galleryPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={goToNextGalleryPage}
                disabled={galleryPage === galleryTotalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Links */}
        <aside className="w-72">
          {/* Notices */}
          <div className="space-y-4 p-6 mb-16">
            <h2 className="text-2xl font-bold mb-4"> নোটিশ সূমহ </h2>
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white flex items-center justify-between p-4 rounded shadow mb-10"
              >
                <h2 className="text-base font-semibold text-gray-800">
                  {notice.title}
                </h2>
                <Link
                  to={`/notice/${notice._id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                  target="_blank"
                >
                  বিস্তারিত
                </Link>
              </div>
            ))}
            <Link
              to="/all-notices-view"
              className="bg-blue-600 px-4 py-3 text-white font-bold cursor-pointer"
            >
              সব নোটিশ দেখুন
            </Link>
          </div>

          {/* Links */}
          <h2 className="text-2xl font-bold mb-4">গুরুত্বপূর্ণ লিংকসূমহ</h2>
          <ul className="space-y-4">
            {links.length > 0 ? (
              links.map((link) => (
                <li key={link._id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    {link.title}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No links available.</p>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
