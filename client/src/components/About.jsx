import { TfiLayoutLineSolid } from "react-icons/tfi";
import { IoShieldCheckmark } from "react-icons/io5";

const About = () => {
  return (
    <section className="w-full min-h-[40vh] flex flex-col lg:flex-row items-center justify-center gap-8 px-6 lg:px-16 mb-10 bg-gray-50 py-8 lg:py-0">
      {/* Image + Video section */}
      <div className="lg:w-2/5 md:w-4/5 w-full relative flex justify-center items-center">
        <img
          src="/assets/about.jpg"
          alt="about"
          className="w-4/5 md:w-full rounded-lg shadow-lg object-cover"
        />
        {/* Video overlay BOTTOM-RIGHT */}
        <div className="absolute bottom-4 right-4 w-53 sm:w-59 md:w-63 max-w-[80%] rounded-lg shadow-lg border-4 border-white overflow-hidden z-10">
          <video
            src="/assets/video.mp4"
            className="w-full h-auto rounded-lg"
            controls
            autoPlay
            loop
            muted
          />
        </div>
      </div>

      {/* About text section */}
      <div className="lg:w-3/5 md:w-[70%] w-full flex flex-col justify-center px-4 md:px-12">
        <div className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
          <span>About Us</span>
          <TfiLayoutLineSolid size={26} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          We Are Maximize Your Learning Growth
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-7 max-w-xl leading-relaxed">
          We provide a modern Learning Management System to simplify online
          education, track progress, and enhance student-instructor
          collaboration efficiently.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 max-w-2xl">
          {[
            "Simplified Learning",
            "Expert Trainers",
            "Big Experience",
            "Continuous Support",
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-gray-700 font-medium"
            >
              <IoShieldCheckmark
                size={20}
                className="text-green-600 flex-shrink-0"
              />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
