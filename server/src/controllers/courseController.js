import Course from "../models/Course.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Lecture from "../models/Lecture.js";
import User from "../models/User.js";

// For Courses
export const createCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in to create a course",
      });
    }

    let { title, subtitle, description, category, level, price, thumbnail } =
      req.body;

    title = title?.trim();
    subtitle = subtitle?.trim();
    description = description?.trim();
    category = category?.trim();
    thumbnail = thumbnail?.trim();

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required",
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters long",
      });
    }

    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    const existingCourse = await Course.findOne({
      title: new RegExp(`^${title}$`, "i"),
      creator: req.user.id,
    });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "You already have a course with this title",
      });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      category,
      level,
      price,
      thumbnail,
      creator: req.user.id,
      isPublished: false,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("lectures")
      .populate({
        path: "reviews",
        select: "rating comment reviewedAt",
        populate: {
          path: "user",
          select: "name photoUrl role",
        },
      });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No published courses found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error finding courses:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const courses = await Course.find({ creator: userId });

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this creator" });
    }

    return res
      .status(200)
      .json({ message: "Creator courses get successfully", data: courses });
  } catch (error) {
    console.error("Error fetching creator courses:", error);
    return res.status(500).json({ message: "Failed to get creator courses" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subtitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (price !== undefined) updateData.price = price;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(course);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to edit Course: ${error.message}` });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }

    // Find course, excluding soft-deleted ones
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by ID",
      error: error.message,
    });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Course.findByIdAndDelete(courseId);

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error removing course:", error);
    return res.status(500).json({ message: "Failed to remove course" });
  }
};

// For Lectures
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    // Validate inputs
    if (!lectureTitle?.trim()) {
      return res.status(400).json({ message: "Lecture title is required" });
    }
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create lecture
    const lecture = await Lecture.create({ lectureTitle });

    // Link lecture to course
    course.lectures.push(lecture._id);
    await course.save();

    // Populate lectures for response
    await course.populate("lectures");

    return res.status(201).json({
      message: "Lecture created successfully",
      lecture,
      course,
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({ message: "Failed to create lecture" });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Fetch course with lectures populated
    const course = await Course.findById(courseId).populate("lectures").lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: "Course lectures fetched successfully",
      course,
    });
  } catch (error) {
    console.error("Error getting course lectures:", error);
    return res.status(500).json({ message: "Failed to get course lectures" });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body || {}; // safe destructuring

    if (!mongoose.isValidObjectId(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (req.file) {
      const videoUrl = await uploadOnCloudinary(req.file.path);
      if (!videoUrl) {
        return res.status(500).json({ message: "Video upload failed" });
      }
      lecture.videoUrl = videoUrl;
    }

    if (lectureTitle && lectureTitle.trim()) {
      lecture.lectureTitle = lectureTitle.trim();
    }

    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree =
        isPreviewFree === true ||
        isPreviewFree === "true" ||
        isPreviewFree === 1 ||
        isPreviewFree === "1";
    }

    await lecture.save();

    return res.status(200).json({
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error editing lecture:", error);
    return res.status(500).json({ message: "Failed to edit lecture" });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Validate MongoDB ID
    if (!mongoose.isValidObjectId(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" });
    }

    // Find lecture and course
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const course = await Course.findOne({ lectures: lectureId });
    if (!course) {
      return res.status(404).json({ message: "Parent course not found" });
    }

    // Remove lecture document
    await Lecture.deleteOne({ _id: lectureId });

    // Remove lecture reference from course
    await Course.updateOne(
      { _id: course._id },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      message: "Lecture removed successfully",
      courseId: course._id,
      removedLectureId: lectureId,
    });
  } catch (error) {
    console.error("Error removing lecture:", error);
    return res.status(500).json({ message: "Failed to remove lecture" });
  }
};

// get creator
export const getCreatorById = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from request" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error get creator:", error);
    return res.status(500).json({ message: "Failed to get creator" });
  }
};
