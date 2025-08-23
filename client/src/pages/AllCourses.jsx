import { FaFilter, FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "../components/Card";

const categories = [
  "Web Development",
  "App Development",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Data Science",
  "Data Analysis",
  "AI/ML Engineer",
  "Cloud Engineer",
  "Others",
];

const AllCourses = () => {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let courseCopy = courseData?.slice();
    if (category.length > 0) {
      courseCopy = courseCopy.filter((c) => category.includes(c.category));
    }
    setFilterCourse(courseCopy);
  };

  useEffect(() => {
    setFilterCourse(courseData);
  }, [courseData]);

  useEffect(() => {
    applyFilter();
  }, [category]);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Layout */}
      <div className="flex flex-1 pt-20">
        {/* Sidebar (Mobile Toggle Button) */}
        <button
          className="md:hidden fixed top-20 left-4 z-40 bg-gray-800 text-white p-2 rounded-lg shadow-lg transition hover:bg-gray-700"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open filter sidebar"
        >
          <FaFilter size={18} />
        </button>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-screen md:h-auto w-70 bg-white md:bg-transparent p-6 md:pt-0 border-r md:border-none shadow-lg md:shadow-none transition-transform duration-300 ease-in-out z-40 md:z-0 overflow-y-auto
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {/* Mobile Sidebar Header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-lg font-semibold">Filter by Category</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-600 hover:text-black"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Filter Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-sm"
          >
            {/* Categories */}
            <div className="space-y-3 bg-gray-200 border border-gray-200 p-4 rounded-lg">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer hover:text-gray-800"
                >
                  <input
                    type="checkbox"
                    value={cat}
                    checked={category.includes(cat)}
                    onChange={toggleCategory}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </form>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterCourse?.length > 0 ? (
              filterCourse.map((course, i) => (
                <Card
                  key={i}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  reviews={course.reviews}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg py-10">
                No courses found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllCourses;
