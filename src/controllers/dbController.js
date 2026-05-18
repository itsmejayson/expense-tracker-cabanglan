import pool from "../db/pool.js"; // Import PostgreSQL connection pool

export const testDbConnection = async (req, res) => {
  // Controller for GET /api/db-test
  try {
    const { rows } = await pool.query("SELECT NOW() AS now"); // Run test database query

    res.json({
      message: "Database connected", // Success response message
      time: rows[0].now, // Return database server time
    });
  } catch (error) {
    console.error("Database test failed:", error); // Log error for debugging

    res.status(500).json({
      message: "Database connection failed", // Send safe error message to client
    });
  }
};