import { Router } from "express"; // Import Express Router
import { testDbConnection } from "../controllers/dbController.js"; // Import controller
import * as userController from "../controllers/userController.js"; // Import all user controllers
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Import auth middleware
import * as transactionController from "../controllers/transactionController.js"; // Import all transaction controllers
import * as dashboardController from "../controllers/dashboardController.js"; // Import all dashboard controllers

const router = Router(); // Create router instance

router.get("/db-test", testDbConnection); // Route calls controller
router.post("/create-user", userController.createUser); // Route calls controller
router.get("/users", authMiddleware, userController.getAllUsers); // Route calls controller
router.get("/user/:id", authMiddleware, userController.getUserById); // Route calls controller
router.post("/login", userController.loginUser); // Route calls controller
router.post("/transactions", authMiddleware, transactionController.createTransaction); // Routecalls controller
router.get("/categories/:id", authMiddleware, transactionController.getCategories); // Route calls controller
router.get("/payment-methods/:id", authMiddleware, transactionController.getPaymentMethods); // Route calls controller
router.get("/dashboard-summary/:id", authMiddleware, async (req, res, next) => {
  try {
    const dashboardData = await Dashboard.getSummary(req.params.id); // Get dashboard summary data for user
    res.status(200).json(dashboardData); // Send summary data to frontend
  } catch (error) {
    next(error); // Pass errors to central error handler
  }
});
router.get("/dashboard/:id", authMiddleware, dashboardController.getDashboard); // Route calls controller
router.delete("/transactions/:id", authMiddleware, transactionController.deleteTransaction); // Route calls controller
router.patch("/transactions/:id", authMiddleware, transactionController.updateTransaction); // Route calls controller

export default router; // Export router for app.js