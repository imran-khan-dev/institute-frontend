import { Menu, X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ apiBaseUrl }) => {
  const [instituteCode, setInstituteCode] = useState({});
  const [headlines, setHeadlines] = useState([]);
  const [isLoadingInstitute, setIsLoadingInstitute] = useState(true);
  const [isLoadingHeadlines, setIsLoadingHeadlines] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchInstituteCode = async () => {
      try {
        setIsLoadingInstitute(true);
        const res = await fetch(`${apiBaseUrl}/api/get-institute-code`);
        const data = await res.json();
        setInstituteCode(data[0]);
      } catch (error) {
        console.log("Error fetching institute code:", error);
      } finally {
        setIsLoadingInstitute(false);
      }
    };

    const fetchHeadlines = async () => {
      try {
        setIsLoadingHeadlines(true);
        const response = await fetch(`${apiBaseUrl}/api/all-headlines`);
        const data = await response.json();
        setHeadlines(data);
      } catch (err) {
        console.error("Error fetching headlines:", err);
      } finally {
        setIsLoadingHeadlines(false);
      }
    };

    fetchInstituteCode();
    fetchHeadlines();
  }, [apiBaseUrl]);

  return (
    <header className="w-full bg-white shadow-md mb-5">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Headlines + Institute Code */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <div className="w-full md:w-2/3 flex items-center overflow-hidden">
            <span className="text-sm text-white font-bold mr-4 bg-green-700 py-1 px-4 rounded">
              আপডেট:
            </span>
            {isLoadingHeadlines ? (
              <div className="text-sm text-gray-400 animate-pulse">
                লোড হচ্ছে...
              </div>
            ) : (
              <marquee className="text-sm text-gray-800 font-medium">
                {headlines.map((headline, index) => (
                  <span key={index} className="mr-12">
                    {headline.headline}
                  </span>
                ))}
              </marquee>
            )}
          </div>
          <div className="text-xs md:text-sm font-bold text-gray-600 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1">
            {isLoadingInstitute ? (
              <div className="text-gray-400 animate-pulse">লোড হচ্ছে...</div>
            ) : (
              <>
                <div>
                  EIIN No:{" "}
                  <span className="text-black">{instituteCode.eIINNum}</span>
                </div>
                <div>
                  School Code:{" "}
                  <span className="text-black">
                    {instituteCode.instituteCode}
                  </span>
                </div>
                <div>
                  Reg No:{" "}
                  <span className="text-black">{instituteCode.regNum}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logo + Navigation */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <Link to="/">
            <h1 className="text-lg md:text-2xl font-bold text-green-800 cursor-pointer">
              এক্স ওয়াই জেড বিদ্যালয়
            </h1>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            {["মূলপাতা", "পরিচিতি", "ছবির গ্যালারী", "নোটিশ", "যোগাযোগ"].map(
              (label, idx) => (
                <Link
                  key={idx}
                  to={["/", "", "", "/all-notices-view", ""][idx]}
                  className="text-sm font-semibold text-gray-700 hover:text-green-600 transition"
                >
                  {label}
                </Link>
              )
            )}
            <Link
              to="/login"
              className="text-sm font-semibold text-white bg-green-700 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200"
            >
              লগইন
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 cursor-pointer"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-start gap-4 py-2">
            {["মূলপাতা", "পরিচিতি", "ছবির গ্যালারী", "নোটিশ", "যোগাযোগ"].map(
              (label, idx) => (
                <Link
                  key={idx}
                  to={["/", "", "", "/all-notices-view", ""][idx]}
                  className="text-sm font-medium text-gray-800 hover:text-green-600 w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            )}
            <Link
              to="/login"
              className="text-sm font-semibold text-white bg-green-700 hover:bg-green-600 px-4 py-2 rounded-md transition"
              onClick={() => setMenuOpen(false)}
            >
              লগইন
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  apiBaseUrl: PropTypes.string.isRequired,
};

export default Header;
