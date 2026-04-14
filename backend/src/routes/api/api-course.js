import express from "express";
import { getAllCourses, getCourseById, getCourseBySearch } from "../../data/course-dao.js";
import { getRecentMaterialsByCourse } from "../../data/material-dao.js";
import { getRecentListingsByCourse } from "../../data/marketplace-dao.js";

const router = express.Router();

// GET /course — list all courses (with optional filter: search, department, level, semester)
router.get("/", async (req, res) => {
    try {
        const { search, department, level, semester } = req.query;
        const list = await getAllCourses({ search, department, level, semester });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: "Failed to load courses" });
    }
});

// GET /course/:id/details — aggregated course detail (course + recent materials + recent listings)
router.get("/:id/details", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const course = await getCourseById(id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const [recentMaterials, recentListings] = await Promise.all([
            getRecentMaterialsByCourse(course.courseCode, 3),
            getRecentListingsByCourse(course.courseCode, 4),
        ]);

        res.json({ course, recentMaterials, recentListings });
    } catch (err) {
        res.status(500).json({ error: "Failed to load course details" });
    }
});

// GET /course/:code — search courses by code (backward compat, e.g. /course/COMPSCI)
router.get("/:code", async (req, res) => {
    try {
        const results = await getCourseBySearch(req.params.code);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Error searching course" });
    }
});

export default router;