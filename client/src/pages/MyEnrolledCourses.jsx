import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const MyEnrolledCourses = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="container mx-auto px-4 pt-24 pb-12 flex-1">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <FaArrowLeftLong size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          My Enrolled Courses
        </h1>

        {/* No Courses State */}
        {!userData?.enrolledCourses || userData.enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/assets/no-courses.svg"
              alt="No courses"
              className="w-60 mb-6 opacity-80"
            />
            <p className="text-gray-500 text-lg">
              You haven’t enrolled in any courses yet.
            </p>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userData.enrolledCourses.map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <img
                  src={course?.thumbnail}
                  alt={course?.title || "Course thumbnail"}
                  className="w-full h-40 object-cover"
                />

                {/* Course Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course?.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {course?.category}
                  </p>
                  <p className="text-sm text-gray-500">{course?.level}</p>

                  {/* Action */}
                  <button
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    className="mt-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
