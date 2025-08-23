import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { setUserData } from "../redux/userSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logout successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 bg-black/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 rounded-md border border-white/30 p-1 bg-black"
          />
          <span className="text-white font-semibold text-lg hidden sm:block group-hover:text-gray-200 transition-colors">
            EduNexus
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center space-x-4">
          {userData && (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-800 to-black text-white border border-white/20 flex items-center justify-center cursor-pointer"
                title={userData?.name}
              >
                {userData?.name.slice(0, 1).toUpperCase()}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg shadow-lg bg-white border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/mycourses")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Courses
                  </button>
                </div>
              )}
            </div>
          )}

          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white text-black font-medium"
                  : "border border-white/30 text-white hover:bg-white hover:text-black"
              }`
            }
          >
            Home
          </NavLink>

          {userData?.role === "educator" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "border border-white/30 text-white hover:bg-white hover:text-black"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {userData && (
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-sm transition-all"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden">
          <RxHamburgerMenu
            onClick={() => setShowSidebar(true)}
            className="text-white w-6 h-6 cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-black/95 shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 rounded-md border border-gray-300"
              />
              <span className="font-semibold text-lg text-white">EduNexus</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <IoIosClose className="h-7 w-7" />
            </button>
          </div>

          {/* Account Section */}
          {userData && (
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="font-medium text-white truncate">
                {userData?.name}
              </p>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col py-2">
            <SidebarLink
              label="Home"
              path="/"
              navigate={navigate}
              closeSidebar={() => setShowSidebar(false)}
            />
            {userData?.role === "educator" && (
              <SidebarLink
                label="Dashboard"
                path="/dashboard"
                navigate={navigate}
                closeSidebar={() => setShowSidebar(false)}
              />
            )}
            <SidebarLink
              label="My Profile"
              path="/profile"
              navigate={navigate}
              closeSidebar={() => setShowSidebar(false)}
            />
            <SidebarLink
              label="My Courses"
              path="/mycourses"
              navigate={navigate}
              closeSidebar={() => setShowSidebar(false)}
            />
          </nav>

          {/* Logout */}
          {userData && (
            <div className="border-t border-white/10 px-4 py-4">
              <button
                onClick={() => {
                  handleLogout();
                  setShowSidebar(false);
                }}
                className="w-full py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Sidebar link helper
const SidebarLink = ({ label, path, navigate, closeSidebar }) => (
  <button
    onClick={() => {
      navigate(path);
      closeSidebar();
    }}
    className="px-6 py-3 text-left text-white hover:bg-white/10 transition"
  >
    {label}
  </button>
);

export default Navbar;
