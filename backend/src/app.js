// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import connectDB from "./config/db.js";

// Set the backend port separately from the frontend dev server to avoid conflicts.
const PORT = process.env.PORT ?? 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

//Creates the express server
const app = express();

/**
 * Configure middleware(logging, CORS getSourceMapsSupport, JSON parsing getSourceMapsSupport,
    static files support, cookie parser)

    CORS is configured to allow cookies and these two origins from fetch() requests.
 */


app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
        origin: [FRONTEND_ORIGIN, 'http://localhost:3000', 'http://localhost:5173'],
        credentials: true
    })
);

app.use(express.json());
app.use(express.static("public"));

//Import and use our application routes.
app.use("/", routes);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();