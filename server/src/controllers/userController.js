import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing from request" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, description } = req.body;
    const updateFields = {};

    if (name?.trim()) updateFields.name = name.trim();
    if (description?.trim()) updateFields.description = description.trim();

    if (req.file) {
      try {
        const uploadedImageUrl = await uploadOnCloudinary(req.file.path);
        if (uploadedImageUrl) {
          updateFields.photoUrl = uploadedImageUrl;
        }
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UpdateProfile Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
    });
  }
};
