// Only for admin

import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { isAdmin } from "../../middleware/admin-middleware.js";
import { deleteUserById, users, updateCreditBalance } from "../../data/user-dao.js";
import { deleteMaterialById, getMaterialByStatus, approveMaterial, rejectMaterial } from "../../data/material-dao.js";
import { deleteItemById } from "../../data/marketplace-dao.js";
import { createCourse, deleteCourseById, updateCourse } from "../../data/course-dao.js";
import { addCreditLog } from "../../data/credit-dao.js";

const router = express.Router();

router.use(requiresAuthentication);
router.use(isAdmin);

// ─── Users ────────────────────────────────────────────────────────────────────

// GET /admin/users — list all users (no passwords)
router.get("/users", async (req, res) => {
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

// DELETE /admin/users/:id — delete any user
router.delete("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const success = await deleteUserById(id);
        if (success) return res.sendStatus(204);
        return res.status(404).json({ error: "User not found" });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error during deletion" });
    }
});

// ─── Materials ────────────────────────────────────────────────────────────────

// GET /admin/materials — list all materials (optionally filter by status)
router.get("/materials", async (req, res) => {
    try {
        const { status } = req.query;
        const list = status ? await getMaterialByStatus(status) : await getMaterialByStatus("pending");
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch materials" });
    }
});

// PATCH /admin/materials/:id/approve — approve a material → "live" + award uploader credits
router.patch("/materials/:id/approve", async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const material = await approveMaterial(materialId);
        if (!material) return res.status(404).json({ error: "Material not found" });

        const UPLOAD_REWARD = 200;
        await updateCreditBalance(material.uploaderId, UPLOAD_REWARD);
        await addCreditLog({
            userId: material.uploaderId,
            amount: UPLOAD_REWARD,
            reason: `Material approved: ${material.title}`,
        });

        res.json(material);
    } catch (err) {
        res.status(500).json({ error: "Failed to approve material" });
    }
});

// PATCH /admin/materials/:id/reject — reject a material → "rejected"
router.patch("/materials/:id/reject", async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const material = await rejectMaterial(materialId);
        if (!material) return res.status(404).json({ error: "Material not found" });
        res.json(material);
    } catch (err) {
        res.status(500).json({ error: "Failed to reject material" });
    }
});

// DELETE /admin/materials/:id — force-delete any material
router.delete("/materials/:id", async (req, res) => {
    const materialId = parseInt(req.params.id);
    const success = await deleteMaterialById(materialId);
    if (success) return res.sendStatus(204);
    return res.status(404).json({ error: "Material not found" });
});

// ─── Marketplace ──────────────────────────────────────────────────────────────

// DELETE /admin/marketplace/:id — force-delete any listing
router.delete("/marketplace/:id", async (req, res) => {
    const itemId = parseInt(req.params.id);
    try {
        const success = await deleteItemById(itemId);
        if (success) return res.sendStatus(204);
        return res.status(404).json({ error: "Marketplace item not found" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error during marketplace deletion" });
    }
});

// ─── Courses ──────────────────────────────────────────────────────────────────

// POST /admin/course — create a new course
router.post("/course", async (req, res) => {
    try {
        const { courseCode, courseName } = req.body;
        if (!courseCode?.trim()) return res.status(400).json({ error: "Course code is required" });
        if (!courseName?.trim()) return res.status(400).json({ error: "Course name is required" });
        const newCourse = await createCourse(req.body);
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to create course" });
    }
});

// PATCH /admin/course/:id — update course info
router.patch("/course/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const updatedCourse = await updateCourse(id, req.body);
        if (updatedCourse) return res.json(updatedCourse);
        return res.status(404).json({ error: "Course not found" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update course" });
    }
});

// DELETE /admin/course/:id — delete a course
router.delete("/course/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const success = await deleteCourseById(id);
        if (success) return res.sendStatus(204);
        return res.status(404).json({ error: "Course not found" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete course" });
    }
});

export default router;
