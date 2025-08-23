import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      minlength: [3, "Lecture title must be at least 3 characters"],
      maxlength: [200, "Lecture title cannot exceed 200 characters"],
      index: true,
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: "Invalid video URL format",
      },
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
