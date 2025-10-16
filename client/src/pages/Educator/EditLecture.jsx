import { FaArrowLeftLong } from "react-icons/fa6";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverURL } from "../../App";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lectureTitle: "",
    videoUrl: "",
    isPreviewFree: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${serverURL}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );

        const lecture = data.course.lectures.find(
          (lec) => lec._id === lectureId
        );

        if (lecture) {
          setFormData({
            lectureTitle: lecture.lectureTitle || "",
            videoUrl: lecture.videoUrl || "",
            isPreviewFree: !!lecture.isPreviewFree,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [courseId, lectureId]);

  const handleUpdateLecture = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const editFormData = new FormData();
    editFormData.append("lectureTitle", formData.lectureTitle);

    if (formData.videoUrl instanceof File) {
      editFormData.append("video", formData.videoUrl);
    }

    editFormData.append(
      "isPreviewFree",
      formData.isPreviewFree ? "true" : "false"
    );

    try {
      const { data } = await axios.put(
        `${serverURL}/api/course/editlecture/${lectureId}`,
        editFormData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(
        setLectureData(
          lectureData.map((lecture) =>
            lecture._id === lectureId ? data.lecture : lecture
          )
        )
      );

      toast.success("Lecture updated successfully!");
      setTimeout(() => navigate(`/createlecture/${courseId}`), 500);
    } catch (error) {
      console.error("Lecture update error:", error);
      toast.error(
        error?.response?.data?.message || "Lecture update failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Go back"
            >
              <FaArrowLeftLong className="text-gray-600 text-lg" />
            </button>
            <h2 className="text-2xl font-semibold tracking-tight">
              Update Course Lecture
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Lecture Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lecture Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lectureTitle}
                onChange={(e) =>
                  setFormData({ ...formData, lectureTitle: e.target.value })
                }
                id="title"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Enter lecture title"
              />
            </div>

            {/* Video Preview if exists */}
            {typeof formData.videoUrl === "string" && formData.videoUrl && (
              <div className="mb-4">
                <video
                  src={formData.videoUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full rounded-md border border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current video — uploading a new file will replace it.
                </p>
              </div>
            )}

            {/* Video Upload */}
            <div>
              <label
                htmlFor="video"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.files[0] })
                }
                className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 focus:outline-none"
              />
            </div>

            {/* Is Free */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isPreviewFree}
                onChange={(e) =>
                  setFormData({ ...formData, isPreviewFree: e.target.checked })
                }
                id="isFree"
                className="accent-black h-4 w-4"
              />
              <label htmlFor="isFree" className="text-sm text-gray-700">
                Is this video free?
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleUpdateLecture}
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition"
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Update Lecture"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditLecture;
