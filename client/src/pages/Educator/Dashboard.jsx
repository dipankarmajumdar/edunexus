import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData =
    creatorCourseData.data?.map((course) => ({
      name:
        course?.title?.length > 15
          ? course.title.slice(0, 15) + "..."
          : course.title,
      lectures: course?.lectures?.length || 0,
    })) || [];

  const enrolledData =
    creatorCourseData.data?.map((course) => ({
      name:
        course?.title?.length > 15
          ? course.title.slice(0, 15) + "..."
          : course.title,
      enrolled: course?.enrollmentStudents?.length || 0,
    })) || [];

  const totalEarning =
    creatorCourseData?.data?.reduce((sum, course) => {
      const studentCount = course.enrollmentStudents?.length || 0;
      const courseRevenue = course.price ? course.price * studentCount : 0;

      return sum + courseRevenue;
    }, 0) || 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="flex-1 px-6 pt-24 pb-10 bg-gray-50 space-y-10">
        {/* Back Button */}

        {/* Educator Info Card */}
        <section className="max-w-5xl mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt="Educator"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-semibold shadow">
              {userData?.name?.[0]?.toUpperCase() || "Educator"}
            </div>
          )}

          {/* Text Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"}
            </h1>
            <p className="text-xl font-semibold text-gray-800">
              Total Earning:{" "}
              <span className="text-lg text-green-600 font-light">
                ₹ {totalEarning}
              </span>
            </p>
            <p className="text-gray-600 text-md leading-relaxed">
              {userData?.description ||
                "Start creating courses and grow your audience."}
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-black text-white px-4 py-2 rounded-lg active:bg-gray-800 cursor-pointer"
            >
              Create Courses
            </button>
          </div>
        </section>

        {/* Graph Section Placeholder */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Course Progress (Lectures)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={courseProgressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="lectures" fill="#000" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Student Enrollment */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enrolledData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="enrolled" fill="#000" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
