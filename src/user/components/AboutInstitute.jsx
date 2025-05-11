import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AboutInstitute = ({ apiBaseUrl }) => {
  const [about, setAbout] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutInstitute = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/get-about-institute`);
        const data = await res.json();
        setAbout(data[0]);
      } catch (error) {
        console.log("Error fetching about institute:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutInstitute();
  }, [apiBaseUrl]);

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center">
        প্রতিষ্ঠান সম্পর্কে
      </h2>
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-4/5 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-11/12 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-full mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
        </div>
      ) : (
        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
          {about?.description || "তথ্য উপলব্ধ নয়।"}
        </p>
      )}
    </section>
  );
};

AboutInstitute.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default AboutInstitute;
