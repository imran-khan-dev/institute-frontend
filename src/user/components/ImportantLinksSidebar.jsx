import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function ImportantLinkSidebar({ apiBaseUrl }) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/get-links`);
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.log("Error fetching links:", error);
    } finally {
      setIsLoading(false); // Turn off loading regardless of success/failure
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">গুরুত্বপূর্ণ লিংকসূমহ</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading links...</p>
      ) : (
        <ul className="space-y-3">
          {links.length > 0 ? (
            links.map((link) => (
              <li key={link._id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#057957] hover:underline block"
                >
                  {link.title}
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No links available.</p>
          )}
        </ul>
      )}
    </div>
  );
}

ImportantLinkSidebar.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default ImportantLinkSidebar;
