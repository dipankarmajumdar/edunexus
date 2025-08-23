import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { serverURL } from "../App";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";

const ViewLecture = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );

  // Fetch creator info
  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourse?.creator) return;
      try {
        const { data } = await axios.get(`${serverURL}/api/course/creator`, {
          withCredentials: true,
        });
        setCreatorData(data);
      } catch (error) {
        console.error("Get creator error:", error);
      }
    };
    fetchCreator();
  }, [selectedCourse]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6 mt-[64px]">
        {/* Left Section - Video + Details */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-200">
          {/* Back + Title */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-4 text-gray-800">
              <FaArrowLeftLong
                className="text-gray-700 hover:text-black w-5 h-5 cursor-pointer transition"
                onClick={() => navigate("/")}
              />
              {selectedCourse?.title}
            </h2>

            <div className="mt-2 flex flex-wrap gap-4 text-xs md:text-sm text-gray-500 font-medium">
              <span>Category: {selectedCourse?.category}</span>
              <span>Level: {selectedCourse?.level}</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-md overflow-hidden border border-gray-300">
            {selectedLecture?.videoUrl ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-sm md:text-base">
                Select a lecture to watch
              </div>
            )}
          </div>

          {/* Lecture Title */}
          <div className="mt-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {selectedLecture?.lectureTitle || "No lecture selected"}
            </h2>
          </div>
        </div>

        {/* Right Section - Lecture List + Educator Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          {/* Lectures */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
              All Lectures
            </h2>
            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.length > 0 ? (
                selectedCourse?.lectures?.map((lecture, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition ${
                      selectedLecture?._id === lecture._id
                        ? "bg-gray-200 border-gray-500"
                        : "hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    <h2 className="text-sm font-medium text-gray-800 truncate">
                      {lecture.lectureTitle}
                    </h2>
                    <FaPlayCircle size={20} className="text-gray-600" />
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No lectures available.</p>
              )}
            </div>
          </div>

          {/* Educator Info */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Educator
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={creatorData?.photoUrl || "/default-avatar.png"}
                alt="educator"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-base font-medium text-gray-800">
                  {creatorData?.name || "Unknown"}
                </h2>
                <p className="text-sm text-gray-600">
                  {creatorData?.description || "No description provided"}
                </p>
                <p className="text-sm text-gray-600">
                  {creatorData?.email || "No email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLecture;
