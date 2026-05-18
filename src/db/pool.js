import pg from "pg"; // Import PostgreSQL package
import "dotenv/config"; // Load environment variables from .env

const { Pool } = pg; // Extract Pool class from pg package

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use database URL from .env
});

export const connectDb = async () => {
  // Function used by server.js to test database connection on startup
  const client = await pool.connect(); // Try to get a real database connection

  try {
    await client.query("SELECT NOW()"); // Run a simple query to confirm DB works
    console.log("PostgreSQL connected"); // Log success
  } finally {
    client.release(); // Always release client back to pool
  }
};

export default pool; // Export pool for controllers/services