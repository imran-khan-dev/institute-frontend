import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#057957] text-white mt-16">
      <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">এক্স ওয়াই জেড বিদ্যালয়</h2>
          <p className="text-sm leading-relaxed">
            একটি বিশ্বস্ত শিক্ষাপ্রতিষ্ঠান যেখানে শিক্ষার্থীদের উন্নত ভবিষ্যতের
            জন্য প্রস্তুত করা হয়। আমরা শিক্ষার মান এবং চরিত্র গঠনে বিশ্বাসী।
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">যোগাযোগ</h3>
          <ul className="text-sm space-y-2">
            <li>ঠিকানা: গ্রাম, উপজেলা, জেলা</li>
            <li>ফোন: ০১২৩৪৫৬৭৮৯০</li>
            <li>ইমেইল: info@xyzschool.edu.bd</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">লিংক</h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                হোম
              </Link>
            </li>
            <li>
              <Link to="/all-notices-view" className="hover:underline">
                নোটিশ
              </Link>
            </li>
            <li>
              <Link to="" className="hover:underline">
                গ্যালারী
              </Link>
            </li>
            <li>
              <Link to="" className="hover:underline">
                যোগাযোগ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#3bce4c] text-center text-sm py-4">
        &copy; {new Date().getFullYear()} এক্স ওয়াই জেড বিদ্যালয়. সর্বস্বত্ব
        সংরক্ষিত।
      </div>
    </footer>
  );
}

export default Footer;
