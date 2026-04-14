import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { deleteUserById, updateMyProfile, changePassword, verifyUserPassword } from "../../data/user-dao.js";
import { getMaterialById, deleteMaterialById, updateMaterialById, getMaterialByUploaderId, deleteMaterialsByUploaderId } from "../../data/material-dao.js";
import { getItemBysellerId, updateItemById, deleteItemById, getItemById, deleteItemsBySellerId } from "../../data/marketplace-dao.js";
import { uploadAvatar, filePathToUrl } from "../../middleware/upload-middleware.js";

const router = express.Router();

// All routes below require authentication
router.use(requiresAuthentication);

// ─── Profile ──────────────────────────────────────────────────────────────────

// GET /me — full user profile (no password)
router.get("/", async (req, res) => {
    const { password, ...profile } = req.user;
    res.json(profile);
});

// PATCH /me — update profile fields (bio, phone, upi, notifPrefs, etc.)
router.patch("/", async (req, res) => {
    try {
        const updated = await updateMyProfile(req.user.id, req.body);
        if (!updated) return res.sendStatus(404);
        const { password, ...profile } = updated;
        res.json(profile);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// PATCH /me/password — change password (must verify current password first)
router.patch("/password", async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const valid = await verifyUserPassword(req.user, currentPassword);
    if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
    }

    await changePassword(req.user.id, newPassword);
    res.json({ message: "Password updated successfully" });
});

// PATCH /me/avatar — upload a new avatar image
router.patch("/avatar", (req, res) => {
    uploadAvatar.single("avatar")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No avatar file uploaded" });
        }

        const avatarUrl = filePathToUrl(req.file.path);
        const updated = await updateMyProfile(req.user.id, { avatarUrl });
        const { password, ...profile } = updated;
        res.json({ avatarUrl, user: profile });
    });
});

// DELETE /me — delete own account (cascade: materials & marketplace items)
router.delete("/", async (req, res) => {
    try {
        await deleteMaterialsByUploaderId(req.user.id);
        await deleteItemsBySellerId(req.user.id);
        const success = await deleteUserById(req.user.id);
        if (success) {
            res.clearCookie("authToken");
            return res.sendStatus(204);
        }
        return res.sendStatus(404);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete account" });
    }
});

// ─── My Materials ──────────────────────────────────────────────────────────────

// GET /me/material — my uploaded materials (with pagination)
router.get("/material", async (req, res) => {
    try {
        const all = await getMaterialByUploaderId(req.user.id);
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 20;
        const total = all.length;
        const items = all.slice((page - 1) * limit, page * limit);
        res.json({ items, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your materials" });
    }
});

// DELETE /me/material/:id — delete my material
router.delete("/material/:id", async (req, res) => {
    const materialId = parseInt(req.params.id);
    const material = await getMaterialById(materialId);

    if (!material) return res.status(404).json({ error: "Material not found" });
    if (material.uploaderId !== req.user.id) {
        return res.status(403).json({ error: "You can only delete your own materials" });
    }

    await deleteMaterialById(materialId);
    res.sendStatus(204);
});

// PATCH /me/material/:id — edit my material
router.patch("/material/:id", async (req, res) => {
    const materialId = parseInt(req.params.id);
    const material = await getMaterialById(materialId);

    if (!material) return res.status(404).json({ error: "Material not found" });
    if (material.uploaderId !== req.user.id) {
        return res.status(403).json({ error: "You can only update your own materials" });
    }

    try {
        const updated = await updateMaterialById(materialId, req.body);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// ─── My Marketplace Items ──────────────────────────────────────────────────────

// GET /me/marketplace — my listed items (with pagination)
router.get("/marketplace", async (req, res) => {
    try {
        const all = await getItemBysellerId(req.user.id);
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 20;
        const total = all.length;
        const items = all.slice((page - 1) * limit, page * limit);
        res.json({ items, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your marketplace items" });
    }
});

// PATCH /me/marketplace/:id — edit my listing
router.patch("/marketplace/:id", async (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = await getItemById(itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.sellerId !== req.user.id) {
        return res.status(403).json({ error: "You can only update your own items" });
    }

    try {
        const updated = await updateItemById(itemId, req.body);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// DELETE /me/marketplace/:id — delete my listing
router.delete("/marketplace/:id", async (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = await getItemById(itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.sellerId !== req.user.id) {
        return res.status(403).json({ error: "You can only delete your own items" });
    }

    const success = await deleteItemById(itemId);
    if (success) res.sendStatus(204);
    else res.status(500).json({ error: "Delete failed" });
});

export default router;
