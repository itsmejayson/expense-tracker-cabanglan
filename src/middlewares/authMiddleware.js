import jwt from "jsonwebtoken"; // Import JWT so we can verify tokens

export const authMiddleware = (req, res, next) => {
  // Read Authorization header from request
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Stop request if token is missing
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const token = authHeader.split(" ")[1]; // Get token after "Bearer"

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode payload

    req.user = decoded; // Save decoded user data for controllers

    next(); // Continue to the controller
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};