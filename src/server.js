import "dotenv/config"; // Load environment variables
import app from "./app.js"; // Import Express app
import { connectDb } from "./db/pool.js"; // Import DB startup connection test

const PORT = process.env.PORT ?? 5000; // Use PORT from .env or fallback

const startServer = async () => {
  // Start app only after required services are ready
  try {
    await connectDb(); // Verify database connection before listening

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // Start HTTP server
    });
  } catch (error) {
    console.error("Failed to start server:", error); // Log startup failure
    process.exit(1); // Stop app if DB connection fails
  }
};

startServer(); // Run startup function