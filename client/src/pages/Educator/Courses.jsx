import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import useGetCreatorCourse from "../../customHooks/useGetCreatorCourse";

const Courses = () => {
  useGetCreatorCourse();

  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="w-full min-h-screen p-4 sm:p-6 bg-gray-100 mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              All Created Courses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and edit your existing courses here.
            </p>
          </div>
          <button
            onClick={() => navigate("/create-course")}
            className="px-3 py-1.5 bg-black border-2 border-black text-white rounded-lg active:bg-gray-800 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black transition duration-300"
          >
            Create Course
          </button>
        </div>

        {/* Large Screen Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 font-medium flex-col items-center justify-center">
                <th className="py-3 px-4">Courses</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.data?.map((course, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-4">
                    <img
                      src={course?.thumbnail || "/assets/empty.jpg"}
                      alt="Thumbnail"
                      className="w-20 h-14 object-cover rounded-md border border-gray-200"
                    />
                    <span className="font-medium text-gray-800">
                      {course?.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹ {course?.price || "NA"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        course?.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer transition duration-200"
                    >
                      <FaEdit size={20} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-sm text-gray-500 mt-6">
            A list of your recent courses.
          </p>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.data?.map((course, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-100"
            >
              <>
                <div className="flex gap-4 items-center">
                  <img
                    src={course?.thumbnail || "/assets/empty.jpg"}
                    alt="course1"
                    className="w-16 h-16 rounded-md object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h1 className="font-medium text-sm text-gray-800">
                      {course?.title}
                    </h1>
                    <p className="text-gray-600 text-xs mt-1">
                      ₹ {course?.price || "NA"}
                    </p>
                  </div>
                  <FaEdit
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                    size={18}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer transition duration-200"
                  />
                </div>
                <span
                  className={`w-fit px-3 py-1 text-xs rounded-full font-medium ${
                    course?.isPublished
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {course?.isPublished ? "Published" : "Draft"}
                </span>
              </>
            </div>
          ))}

          <p className="text-center text-sm text-gray-500 mt-4">
            A list of your recent courses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Courses;
