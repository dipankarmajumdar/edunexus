import Course from "../models/Course.js";

/**
 * @desc    Search courses with AI-powered fuzzy matching
 * @route   POST /api/search
 * @access  Public
 */
export const searchWithAI = async (req, res) => {
  try {
    const { input } = req.body;

    // validation
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Escape regex special characters to prevent regex DoS
    const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // query
    const query = {
      isPublished: true,
      $or: [
        { title: { $regex: escapedInput, $options: "i" } },
        { subtitle: { $regex: escapedInput, $options: "i" } },
        { description: { $regex: escapedInput, $options: "i" } },
        { category: { $regex: escapedInput, $options: "i" } },
        { level: { $regex: escapedInput, $options: "i" } },
      ],
    };

    // Execute query with field selection
    const courses = await Course.find(query)
      .select("title subtitle category level price thumbnail")
      .lean();

    // Response
    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("❌ SearchWithAI Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching courses",
    });
  }
};
