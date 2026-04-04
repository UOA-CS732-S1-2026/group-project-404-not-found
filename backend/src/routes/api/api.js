import express from "express";

const router = express.Router();

//Authentication
import authRoutes from "./api-auth.js";
router.use("/", authRoutes);

//User
import userRoutes from "./api-user.js";
router.use("/user", userRoutes);

// //Course
// import courseRoutes from "./api-course.js";
// router.use("/course", courseRoutes);

// //Material
// import materialRoutes from "./api-material.js";
// router.use("/material", materialRoutes);

// //Marketplace
// import marketRoutes from "./api-marketplace.js";
// router.jse("/marketplace", marketRoutes);

export default router;

