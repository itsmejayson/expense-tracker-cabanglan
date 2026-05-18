import Dashboard from "../models/dashboardModel.js"; // Import dashboard model

export const getDashboard = async (req, res, next) => {
  // Controller for GET /api/dashboard
  try {
    const dashboard = await Dashboard.getDashboardData(req.user.id); // Get dashboard data for logged-in user

    res.status(200).json(dashboard); // Send dashboard data to frontend
  } catch (error) {
    next(error); // Pass errors to central error handler
  }
};