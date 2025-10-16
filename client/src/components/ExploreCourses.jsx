import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import {
  FaCode,
  FaDev,
  FaServer,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import { MdCloudQueue } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    icon: TbDeviceDesktopAnalytics,
    label: "Web Development",
    color: "bg-pink-200",
  },
  { icon: LiaUikit, label: "UI/UX Design", color: "bg-yellow-200" },
  { icon: FaCode, label: "Full Stack Development", color: "bg-green-200" },
  { icon: FaDev, label: "Frontend Development", color: "bg-blue-200" },
  { icon: FaServer, label: "Backend Development", color: "bg-purple-200" },
  { icon: FaChartBar, label: "Data Science", color: "bg-orange-200" },
  { icon: FaChartLine, label: "Data Analysis", color: "bg-teal-200" },
  { icon: MdCloudQueue, label: "Cloud Engineer", color: "bg-red-200" },
];

const ExploreCourses = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12">
        {/* Left Panel */}
        <div className="flex flex-col justify-center max-w-sm">
          <h2 className="text-4xl font-bold text-gray-900 leading-snug">
            Explore <br /> Our Courses
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-md">
            Learn from industry experts with hands-on projects and real-world
            case studies. Upgrade your skills to accelerate your career growth.
          </p>
          <button
            onClick={() => navigate("/allcourses")}
            className="max-w-55 mt-6 px-5 py-2.5 border-2 bg-black text-white rounded-lg text-lg font-light inline-flex items-center justify-center gap-2 active:bg-gray-800 transition cursor-pointer"
          >
            Explore Courses <SiViaplay className="w-5 h-5 mt-1" />
          </button>
        </div>

        {/* Courses Grid */}
        <div className="flex-[2] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map(({ icon: Icon, label, color }, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-white shadow hover:shadow-lg transition duration-300"
            >
              <div
                className={`w-20 h-20 ${color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-12 h-12 text-gray-700" />
              </div>
              <span className="mt-3 text-sm sm:text-base font-medium text-gray-800">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCourses;
