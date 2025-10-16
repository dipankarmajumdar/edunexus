import { useNavigate } from "react-router-dom";
import CardPage from "../components/CardPage";
import ExploreCourses from "../components/ExploreCourses";
import Logos from "../components/Logos";
import Navbar from "../components/Navbar";
import { SiViaplay } from "react-icons/si";
import Footer from "../components/Footer";
import About from "../components/About";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen">
        {/* Background Image */}
        <img
          src="/assets/home1.jpg"
          alt="home"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 lg:pt-28 gap-6">
          {/* Heading */}
          <div className="text-white max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Grow Your Skills to Advance
            </h1>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold mt-2">
              Your Career Path
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/allcourses")}
              className="px-6 py-3 border-2 border-white text-white text-lg font-medium flex items-center gap-2 hover:bg-white hover:text-black rounded-lg transition duration-300 cursor-pointer"
            >
              View All Courses <SiViaplay className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Below Hero */}
      <section className="mt-10 px-4 md:px-8 max-w-8xl mx-auto">
        {/* Logos */}
        <div className="mb-10">
          <Logos />
        </div>

        {/* Explore Courses */}
        <div className="mb-14">
          <ExploreCourses />
        </div>

        {/* Extra Info / Featured Cards */}
        <div className="mb-5">
          <CardPage />
        </div>
      </section>

      <div>
        <About />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
