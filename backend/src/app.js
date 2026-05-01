// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import connectDB from "./config/db.js"; 

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

/**
 * Configure middleware
 */
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
        origin: [`http://localhost:${PORT}`, process.env.FRONTEND_ORIGIN],
        credentials: true
    })
);

app.use(express.json());
app.use(express.static("public"));

// Import and use our application routes.
app.use("/", routes);

// Make sure our database is up and running
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`404 NOT FOUND Project server listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed. Server not started.");
});