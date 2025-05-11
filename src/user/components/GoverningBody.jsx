import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const GoverningBody = ({ apiBaseUrl }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoverningBody = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/governing-body-all`);
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching governing body members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoverningBody();
  }, [apiBaseUrl]);

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">
        স্কুল পরিচালকদের বাণী
      </h2>

      {isLoading ? (
        <div className="flex flex-wrap justify-center gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="w-64 bg-gray-50 p-4 rounded-lg shadow animate-pulse"
            >
              <div className="w-full h-60 bg-gray-300 rounded-md mb-4" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-full" />
            </div>
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="w-64 bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={member.imageUrl}
                alt={member.title}
                className="w-full h-60 object-cover rounded-md"
              />
              <h3 className="mt-3 text-xl font-semibold text-gray-800">
                {member.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{member.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No governing body members available.
        </p>
      )}
    </section>
  );
};

GoverningBody.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default GoverningBody;
