import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "./Card";

const CardPage = () => {
  const { courseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6));
  }, [courseData]);

  return (
    <div className="relative flex items-center justify-center flex-col">
      <h1 className="md:text-5xl text-3xl font-semibold text-center mt-7 px-5">
        Our Popular Courses
      </h1>
      <span className="lg:w-1/2 md:w-8/10 text-center mt-7 mb-7 px-5">
        Explore top-rated coures designed to boost your skills, enhance careers,
        and unlock opportunities in tech, AI, business, and beyond.
      </span>
      <div className="w-full flex flex-wrap items-center justify-center gap-12 lg:p-12 md:p-7 p-2.5 mb-10">
        {popularCourses.map((course, i) => (
          <Card
            key={i}
            thumbnail={course.thumbnail}
            title={course.title}
            category={course.category}
            price={course.price}
            id={course._id}
            reviews={course.reviews}
          />
        ))}
      </div>
    </div>
  );
};

export default CardPage;
