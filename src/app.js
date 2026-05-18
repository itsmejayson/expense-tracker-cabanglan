import express from "express"; // Import Express
import routes from "./routes/index.js"; // Import routes
import { errorHandler } from "./middlewares/errorMiddleware.js"; // Import error handler
import cors from "cors"; // Import CORS middleware

const app = express(); // Create Express app

app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Parse JSON request bodies

app.use("/api", routes); // Register routes first

app.use(errorHandler); // Register error handler last

export default app; // Export app