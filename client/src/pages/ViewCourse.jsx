import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { useEffect, useState } from "react";
import { FaLock, FaPlayCircle, FaStar } from "react-icons/fa";
import { serverURL } from "../App";
import Card from "../components/Card";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const { reviewData } = useSelector((state) => state.review);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourse, setCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  // Load selected course
  useEffect(() => {
    if (!courseData?.length) return;
    const selected = courseData.find((course) => course._id === courseId);
    if (selected) {
      dispatch(setSelectedCourse(selected));
    }
  }, [courseData, courseId, dispatch]);

  // Fetch creator info
  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourse?.creator) return;
      try {
        const { data } = await axios.get(`${serverURL}/api/course/creator`, {
          withCredentials: true,
        });
        setCreatorData(data);
      } catch (error) {
        console.error("Get creator error:", error);
      }
    };
    fetchCreator();
  }, [selectedCourse]);

  // Load other courses by creator
  useEffect(() => {
    if (!creatorData?._id || !Array.isArray(courseData)) return;
    const filtered = courseData.filter(
      (c) => c.creator === creatorData._id && c._id !== courseId
    );
    setCreatorCourse(filtered);
  }, [creatorData, courseData, courseId]);

  const handleEnrollment = async (userId, courseId) => {
    try {
      // Create order on backend
      const { data } = await axios.post(
        `${serverURL}/api/payments/order`,
        { userId, courseId },
        { withCredentials: true }
      );

      if (!data.success) {
        console.error("Failed to create order:", data.message);
        return;
      }

      const { order, keyId } = data;

      // Open Razorpay Checkout
      const options = {
        key: keyId, // from backend
        amount: order.amount, // in paise
        currency: order.currency,
        name: "EduNexus",
        description: "Course Enrollment",
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment with backend
            const verifyRes = await axios.post(
              `${serverURL}/api/payments/verify`,
              {
                courseId,
                userId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            if (verifyRes.data.success) {
              setIsEnrolled(true);
              toast.success("Enrollment successful!");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Server verification failed.");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: "9999999999",
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  useEffect(() => {
    setIsEnrolled(false); // reset first
    if (!userData || !courseId) return;

    const verify = userData?.enrolledCourses?.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() === courseId.toString()
    );

    if (verify) {
      setIsEnrolled(true);
    }
  }, [courseId, userData]);

  const handleReview = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const { rating, comment } = formData;

      // Validation
      if (!rating || !comment.trim()) {
        toast.error("Please provide both rating and comment.");
        return;
      }

      const { data } = await axios.post(
        `${serverURL}/api/reviews/create`,
        { rating, comment: comment.trim(), courseId },
        { withCredentials: true }
      );

      toast.success("Review submitted successfully!");

      // Reset form
      setFormData({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Review error:", error);
      toast.error(
        error?.response?.data?.message || "Review failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgReview = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0);
    }, 0);

    return Number((total / reviews.length).toFixed(1));
  };

  const avgRating = calculateAvgReview(selectedCourse?.reviews || []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <section className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Course Header */}
          <div className="flex flex-col lg:flex-row">
            {/* Thumbnail */}
            <div className="w-full lg:w-1/2">
              <img
                src={selectedCourse?.thumbnail || "/assets/empty.jpg"}
                alt={selectedCourse?.title || "Course Thumbnail"}
                className="w-full h-64 sm:h-80 lg:h-full object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {selectedCourse?.title}
                </h1>
                <p className="text-gray-600 mb-4">{selectedCourse?.subtitle}</p>

                {/* Rating & Pricing */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 text-yellow-500 font-medium">
                    <FaStar />
                    <span>{avgRating}</span>
                    <span className="text-gray-700 text-sm">
                      ({selectedCourse?.reviews?.length || 0} Reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800">
                      ₹{selectedCourse?.price}
                    </span>
                    {isEnrolled && (
                      <span className="bg-green-500 text-white px-2 rounded-md">
                        Paid
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ 20+ hours of high-quality video content</li>
                  <li>✅ Lifetime access to course materials</li>
                  <li>✅ Access on mobile, tablet, and desktop</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-6">
                {!isEnrolled ? (
                  <button
                    onClick={() => handleEnrollment(userData._id, courseId)}
                    className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className="w-full sm:w-auto bg-green-100 text-green-600 px-6 py-3 rounded-lg hover:bg-green-200 border border-green-400 transition"
                  >
                    Watch Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Curriculum Section */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                Course Curriculum
              </h2>
              <p className="text-gray-500 mb-4">
                {selectedCourse?.lectures?.length || 0} Lectures
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Lecture List */}
                <div className="flex flex-col gap-2 md:col-span-2 border border-gray-200 rounded-lg bg-white shadow-sm p-3">
                  {selectedCourse?.lectures?.map((lecture, i) => (
                    <button
                      key={i}
                      disabled={!lecture.isPreviewFree}
                      onClick={() =>
                        lecture.isPreviewFree && setSelectedLecture(lecture)
                      }
                      className={`text-left px-4 py-3 rounded-lg border flex items-center gap-3 transition ${
                        lecture.isPreviewFree
                          ? "hover:border-black hover:shadow-md"
                          : "opacity-50 cursor-not-allowed"
                      } ${
                        selectedLecture?.lectureTitle === lecture.lectureTitle
                          ? "bg-gray-100 border-black"
                          : "border-gray-200"
                      }`}
                    >
                      {lecture.isPreviewFree ? (
                        <FaPlayCircle size={20} className="text-gray-700" />
                      ) : (
                        <FaLock size={20} className="text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {lecture.lectureTitle}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Video Player */}
                <div className="bg-white md:col-span-3 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    {selectedLecture?.videoUrl ? (
                      <video
                        src={selectedLecture.videoUrl}
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm text-center px-4">
                        Select a preview lecture to watch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Review Section */}
            <section className="pt-6 border-t">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                Reviews
              </h2>

              {/* Add Review Form */}
              {isEnrolled ? (
                <div className="mb-6 border p-4 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">Write a Review</h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`cursor-pointer ${
                          formData.rating >= star
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                      />
                    ))}
                  </div>

                  <textarea
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    placeholder="Write your review..."
                    className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <button
                    onClick={handleReview}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">
                  You must be enrolled in this course to leave a review.
                </p>
              )}

              {/* Show Reviews */}
              <div className="space-y-4">
                {selectedCourse?.reviews?.length > 0 ? (
                  selectedCourse.reviews.map((review, i) => (
                    <div
                      key={i}
                      className="border p-4 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-800">
                          {review?.user?.name}
                        </p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <FaStar
                              key={idx}
                              size={16}
                              className={
                                idx < review?.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first!</p>
                )}
              </div>
            </section>

            {/* Creator Info */}
            <section className="pt-6 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={creatorData?.photoUrl || "/assets/avater.png"}
                  alt={creatorData?.name || "Creator"}
                  className="w-16 h-16 rounded-full border object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{creatorData?.name}</h2>
                  {creatorData?.description && (
                    <p className="text-sm text-gray-600">
                      {creatorData.description}
                    </p>
                  )}
                  {creatorData?.email && (
                    <p className="text-sm text-gray-600">{creatorData.email}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Other Courses */}
            {creatorCourse?.length > 0 && (
              <section className="pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">
                  Other Courses by {creatorData?.name || "this Educator"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorCourse.map((course, i) => (
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
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewCourse;
