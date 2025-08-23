import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverURL } from "../../App";
import axios from "axios";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const createHandler = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const { title, category } = formData;
      if (!title || !category) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${serverURL}/api/course/create`,
        { title, category },
        { withCredentials: true }
      );

      toast.success("Course created successful!");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error(
        error?.response?.data?.message || "Course creation failed. Try again."
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
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 sm:p-8 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate("/courses")}
            className="absolute left-4 top-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <FaArrowLeftLong className="w-5 h-5" />
          </button>

          {/* Heading */}
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Create Course
          </h2>

          {/* Form */}
          <div className="space-y-6">
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

            {/* Category */}
            <div>
              <label
                htmlFor="cat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>
              <select
                id="cat"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
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
                <option value="Backend Development">Backend Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                onClick={createHandler}
                className="px-5 py-2 bg-black text-white rounded-lg active:bg-gray-800 transition duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
