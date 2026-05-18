export const errorHandler = (error, req, res, next) => {
  // Express recognizes this as an error handler because it has 4 parameters
  console.error(error); // Log the real error for debugging

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error", // Send safe error message
  });
};