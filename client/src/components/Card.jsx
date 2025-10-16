import { IoStar } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Card = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate();

  const { selectedCourse } = useSelector((state) => state.course);

  const calculateAvgReview = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0);
    }, 0);

    return Number((total / reviews.length).toFixed(1));
  };

  const avgRating = calculateAvgReview(reviews);

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 cursor-pointer"
    >
      <img
        src={thumbnail}
        alt="thumbnail"
        className="w-full h-48 object-cover"
      />

      <div className="p-5 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize">
          {category}
        </span>

        <div className="flex justify-between text-sm text-gray-600 mt-3 px-2.5">
          <span className="font-semibold text-gray-800">₹ {price}</span>
          <span className="flex items-center gap-1">
            <IoStar className="text-yellow-500" /> {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
