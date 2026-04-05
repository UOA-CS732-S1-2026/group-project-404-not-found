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
    const newItem = await createItem({
        ...req.body,
        sellerId: req.user.id
    });
    res.status(201).json(newItem);
});

export default router;
