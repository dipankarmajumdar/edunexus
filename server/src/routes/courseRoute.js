import express from "express";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorById,
  getCreatorCourses,
  getPublishedCourses,
  removeCourse,
  removeLecture,
} from "../controllers/courseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import { searchWithAI } from "../controllers/searchController.js";

const courseRoute = express.Router();

// For Courses
courseRoute.post("/create", authMiddleware, createCourse);
courseRoute.get("/getpublished", getPublishedCourses);
courseRoute.get("/get-creator", authMiddleware, getCreatorCourses);
courseRoute.put(
  "/editcourse/:courseId",
  authMiddleware,
  upload.single("thumbnail"),
  editCourse
);
courseRoute.get("/getcoursebyid/:courseId", authMiddleware, getCourseById);
courseRoute.delete("/remove/:courseId", authMiddleware, removeCourse);

// For Lectures
courseRoute.post("/createlecture/:courseId", authMiddleware, createLecture);
courseRoute.get("/courselecture/:courseId", authMiddleware, getCourseLecture);
courseRoute.put(
  "/editlecture/:lectureId",
  authMiddleware,
  upload.single("video"),
  editLecture
);
courseRoute.delete("/removelecture/:lectureId", authMiddleware, removeLecture);
courseRoute.get("/creator", authMiddleware, getCreatorById);

// for search with ai
courseRoute.post("/search", searchWithAI);

export default courseRoute;
