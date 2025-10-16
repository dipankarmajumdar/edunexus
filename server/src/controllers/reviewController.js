import Course from "../models/Course.js";
import Review from "../models/Review.js";

/**
 * @desc    Create a review for a course
 * @route   POST /api/reviews/create
 * @access  Private (requires auth middleware to set req.user)
 */
export const createReview = async (req, res) => {
  try {
    const { rating, comment, courseId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
    }
    if (comment && comment.length > 1000) {
      return res
        .status(400)
        .json({ message: "Comment cannot exceed 1000 characters" });
    }

    const course = await Course.findById(courseId).select("_id reviews").exec();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyReviewed = await Review.findOne({
      course: courseId,
      user: userId,
    }).lean();

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    const review = await Review.create({
      course: courseId,
      user: userId,
      rating,
      comment,
    });

    // Push only the review ID
    course.reviews.push(review._id);
    await course.save({ validateBeforeSave: false });

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("❌ Review creation error:", error);
    return res.status(500).json({
      message: "Internal server error while creating review",
    });
  }
};

/**
 * @desc    Get all reviews
 * @route   GET /api/reviews/get
 * @access  Public / Protected (depending on your app)
 */
export const getReviews = async (req, res) => {
  try {
    // --- Query ---
    const reviews = await Review.find({})
      .populate("user", "name photoUrl role")
      .sort({ reviewedAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    return res.status(500).json({
      message: "Internal server error while fetching reviews",
    });
  }
};
