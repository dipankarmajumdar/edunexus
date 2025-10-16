import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../../App";
import { toast } from "react-toastify";
import { setLectureData } from "../../redux/lectureSlice";
import { FaEdit } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ lectureTitle: "" });

  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!formData.lectureTitle.trim()) {
        toast.error("Please fill in required fields.");
        return;
      }

      const { data } = await axios.post(
        `${serverURL}/api/course/createlecture/${id}`,
        { lectureTitle: formData.lectureTitle },
        { withCredentials: true }
      );

      setFormData({ lectureTitle: "" });
      dispatch(setLectureData([...lectureData, data.lecture]));
      toast.success("Lecture created successfully!");
    } catch (error) {
      console.error("Lecture creation error:", error);
      toast.error(
        error?.response?.data?.message || "Lecture creation failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      const { data } = await axios.delete(
        `${serverURL}/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      );

      dispatch(
        setLectureData(
          lectureData.filter((lecture) => lecture._id !== lectureId)
        )
      );
      toast.success(data.message || "Lecture deleted successfully!");
    } catch (error) {
      console.error("Lecture deletion error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete lecture. Try again."
      );
    }
  };

  useEffect(() => {
    const getCourseLecture = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${serverURL}/api/course/courselecture/${id}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(data.course.lectures || []));
      } catch (error) {
        console.error("Get lectures error:", error);
        toast.error(
          error?.response?.data?.message || "Get lectures failed. Try again."
        );
      } finally {
        setLoading(false);
      }
    };
    getCourseLecture();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Add a New Lecture
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500">
              Provide the lecture title and manage your course lectures here.
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label
              htmlFor="lectureTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lecture Title
            </label>
            <input
              type="text"
              value={formData.lectureTitle}
              onChange={(e) =>
                setFormData({ ...formData, lectureTitle: e.target.value })
              }
              id="lectureTitle"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="e.g. Introduction to MERN Stack"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate(`/edit-course/${id}`)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 border border-gray-300 
              hover:bg-gray-300 rounded-lg transition"
            >
              Back to Course
            </button>

            <button
              onClick={handleCreateLecture}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg 
              hover:bg-gray-800 focus:ring-2 focus:ring-offset-1 focus:ring-black transition"
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                "Create Lecture"
              )}
            </button>
          </div>

          {/* Lecture List */}
          <div className="mt-6 border border-gray-300 rounded-lg shadow-sm overflow-y-auto max-h-56 sm:max-h-64 md:max-h-80">
            {lectureData && lectureData.length > 0 ? (
              lectureData.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-md flex justify-between items-center p-3 text-xs sm:text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <span className="truncate max-w-[150px] sm:max-w-[300px]">
                      {lecture.lectureTitle}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <FaEdit
                      onClick={() =>
                        navigate(`/editlecture/${id}/${lecture._id}`)
                      }
                      size={16}
                      className="text-green-600 cursor-pointer hover:scale-110 transition"
                    />
                    <IoMdTrash
                      onClick={() => handleDeleteLecture(lecture._id)}
                      size={18}
                      className="text-red-600 cursor-pointer hover:scale-110 transition"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-gray-500 py-8 text-sm">
                No lectures available
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLecture;
