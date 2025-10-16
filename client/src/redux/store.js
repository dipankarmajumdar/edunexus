import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import creatorCourseReducer from "./courseSlice.js";
import lectureReducer from "./lectureSlice.js";
import reviewReducer from "./reviewSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: creatorCourseReducer,
    lecture: lectureReducer,
    review: reviewReducer,
  },
});
