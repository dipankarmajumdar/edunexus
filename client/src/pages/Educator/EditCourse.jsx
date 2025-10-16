import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverURL } from "../../App";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";

const EditCourse = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const thumb = useRef();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [formData, setFormData] = useState({
    isPublished: false,
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    price: "",
    thumbnail: null,
  });
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/course/getcoursebyid/${id}`,
        { withCredentials: true }
      );
      setFormData((prev) => ({
        ...prev,
        isPublished: result.data.isPublished,
        title: result.data.title,
        subtitle: result.data.subtitle,
        description: result.data.description,
        category: result.data.category,
        level: result.data.level,
        price: result.data.price,
        thumbnail: result.data.thumbnail,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseById();
  }, []);

  const handleEditCourse = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const editFormData = new FormData();
    editFormData.append("isPublished", String(formData.isPublished));
    if (formData.title) editFormData.append("title", formData.title);
    if (formData.subtitle) editFormData.append("subtitle", formData.subtitle);
    if (formData.description)
      editFormData.append("description", formData.description);
    if (formData.category) editFormData.append("category", formData.category);
    if (formData.level) editFormData.append("level", formData.level);
    if (formData.price) editFormData.append("price", formData.price);
    if (backendImage) editFormData.append("thumbnail", backendImage);

    try {
      const { data } = await axios.put(
        `${serverURL}/api/course/editcourse/${id}`,
        editFormData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updateData = data;
      if (updateData.isPublished) {
        const updateCourses = courseData.map((c) =>
          c._id === id ? updateData : c
        );

        if (!courseData.some((c) => c._id === id)) {
          updateCourses.push(updateData);
        }
        dispatch(setCourseData(updateCourses));
      } else {
        const filterCourses = courseData.filter((c) => c._id !== id);
        dispatch(setCourseData(filterCourses));
      }

      toast.success("Course update successful!");
      navigate("/courses");
    } catch (error) {
      console.error("Course update error:", error);
      toast.error(
        error?.response?.data?.message || "Course update failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.delete(
        `${serverURL}/api/course/remove/${id}`,
        {
          withCredentials: true,
        }
      );
      const filterCourses = courseData.filter((c) => c._id !== id);
      dispatch(setCourseData(filterCourses));

      toast.success("Course deleted successful!");
      navigate("/courses");
    } catch (error) {
      console.error("Course delete error:", error);
      toast.error(
        error?.response?.data?.message || "Course delete failed. Try again."
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
      <div className="flex flex-col items-center justify-center w-full px-4 py-10 mt-16 sm:mt-20">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 sm:p-8 relative">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/courses")}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <FaArrowLeftLong className="w-5 h-5" />
              </button>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                Add details information regarding the course
              </h2>
            </div>

            {/* Go to Lecture Button */}
            <button
              onClick={() => navigate(`/createlecture/${id}`)}
              className="bg-black text-white px-4 py-2 rounded-lg active:bg-gray-800 cursor-pointer text-sm sm:text-base"
            >
              Go to Lecture page
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4">
              Basic course information
            </h2>
            <div className="space-x-2 space-y-2">
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: !prev.isPublished,
                  }))
                }
                className={`${
                  formData.isPublished
                    ? "bg-red-600 text-white" // currently published → red to unpublish
                    : "bg-green-600 text-white" // currently unpublished → green to publish
                } px-4 py-2 rounded-lg cursor-pointer`}
              >
                {formData.isPublished
                  ? "Click to Unpublish"
                  : "Click to Publish"}
              </button>
              <button
                onClick={handleRemoveCourse}
                className="bg-red-600 text-white border border-red-600 px-4 py-2 rounded-lg cursor-pointer"
              >
                Remove Course
              </button>
            </div>
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                id="title"
                placeholder="Enter course title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Sub Title */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                id="subtitle"
                placeholder="Enter course title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="des"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                id="des"
                rows="3"
                placeholder="Enter course description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
              />
            </div>

            {/* Category, Level & Price */}
            <div className="flex flex-col lg:flex-row w-full gap-4">
              {/* Category */}
              <div className="flex-1">
                <label
                  htmlFor="cat"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  id="cat"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="Full Stack Development">
                    Full Stack Development
                  </option>
                  <option value="Frontend Development">
                    Frontend Development
                  </option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Cloud Engineer">Cloud Engineer</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Level */}
              <div className="flex-1">
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  id="level"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Price */}
              <div className="flex-1">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  id="price"
                  placeholder="Enter course price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label
                htmlFor="thumb"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Thumbnail
              </label>
              <input
                type="file"
                onChange={handleThumbnail}
                id="thumb"
                hidden
                ref={thumb}
                accept="image/*"
              />
            </div>
            <div className="relative w-60 h-40">
              <FaEdit
                className="absolute top-1 right-1"
                size={18}
                onClick={() => thumb.current.click()}
              />
              <img
                src={frontendImage || formData.thumbnail || "/assets/empty.jpg"}
                alt="thumb"
                onClick={() => thumb.current.click()}
                className="w-full h-full border border-black rounded-md object-cover"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="px-5 py-2 bg-red-200 text-red-700 border border-red-600 
             hover:bg-red-400 hover:text-white 
             active:bg-red-500 
             rounded-lg transition duration-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleEditCourse}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 active:bg-gray-700 transition duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
