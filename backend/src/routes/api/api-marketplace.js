import express from "express";
import {getAllItems, createItem, getItemById} from "../../data/marketplace-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";

const router = express.Router();

//Search all items(user who doesn't login can see)
router.get("/", async (req, res)=>{
    res.json(await getAllItems());
});

//Post new item(user who do login can do)
router.post("/", requiresAuthentication, async (req, res)=>{
    try {
        const { title, price, category } = req.body;
        
        // Input validation
        if (!title?.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!price || price < 0) {
            return res.status(400).json({ error: "Valid price is required" });
        }
        if (!category?.trim()) {
            return res.status(400).json({ error: "Category is required" });
        }
        
        const newItem = await createItem({
            ...req.body,
            sellerId: req.user.id
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: "Failed to create marketplace item" });
    }
});

export default router;
