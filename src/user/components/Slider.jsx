import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const Slider = ({ apiBaseUrl }) => {
  const [sliders, setSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/slider-images`);
        const data = await response.json();
        setSliders(data);
        setCurrentSlide(0);
      } catch (err) {
        console.error("Error fetching sliders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSliders();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (isPaused || sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, sliders.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleNextSlide = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 500) {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
      lastClickTimeRef.current = now;
    }
  };

  const handlePrevSlide = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 500) {
      setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
      lastClickTimeRef.current = now;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-72 md:h-[400px] bg-gray-300 animate-pulse rounded-xl shadow-lg mb-16" />
    );
  }

  if (sliders.length === 0) return null;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-72 md:h-[400px] overflow-hidden rounded-xl shadow-lg mb-16"
    >
      <img
        src={sliders[currentSlide].imageUrl}
        alt={sliders[currentSlide].title}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent flex items-end p-6">
        <h2 className="text-white text-xl md:text-3xl font-bold">
          {sliders[currentSlide].title}
        </h2>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-2 right-4 flex space-x-3 md:space-x-6 p-2">
        <button
          onClick={handlePrevSlide}
          className="w-7 h-7 text-white bg-green-500/50 hover:bg-green-400/70 cursor-pointer flex items-center justify-center transition"
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
        </button>
        <button
          onClick={handleNextSlide}
          className="w-7 h-7 text-white bg-green-500/50 hover:bg-green-400/70 cursor-pointer flex items-center justify-center transition"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

Slider.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default Slider;
