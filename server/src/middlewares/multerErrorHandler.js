export const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error("Multer Error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
  next();
};
