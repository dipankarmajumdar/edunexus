import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";
import fs from "fs";

// Configure Cloudinary once at startup
cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api,
  api_secret: config.cloudinary.secret,
  secure: false, // Always use HTTPS
});

const uploadOnCloudinary = async (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    console.error("File path is missing or file does not exist.");
    return null;
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      overwrite: false,
      unique_filename: true,
      use_filename: false,
    });

    // Remove local file after upload
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.warn(`Could not delete local file: ${filePath}`, unlinkErr);
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.warn(
        `Could not delete local file after error: ${filePath}`,
        unlinkErr
      );
    }
    return null;
  }
};

export default uploadOnCloudinary;
