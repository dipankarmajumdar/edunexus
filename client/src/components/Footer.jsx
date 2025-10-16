import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Branding Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="EduNexus Logo"
              className="w-12 h-12 rounded-md border border-gray-600 p-1 bg-black"
            />
            <h2 className="text-white font-bold text-2xl">EduNexus</h2>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-gray-400">
            AI-powered learning platform designed to help you grow smarter.
            Learn anything, anytime, anywhere — with expert guidance and
            cutting-edge tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li
              className="cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => navigate("/allcourses")}
            >
              All Courses
            </li>
            <li
              className="cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} EduNexus | Dipankar Majumdar. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
