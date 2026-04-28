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

//Search item by ID(user who doesn't login can see)
router.get("/:id", async (req, res)=>{
    const item = await getItemById(parseInt(req.params.id));
    if(!item) return res.status(404).json({error: "Item not found"});
    res.json(item);
});

//update item by ID(user who do login can do)
router.put("/:id", requiresAuthentication, async (req, res)=>{
    const itemId = parseInt(req.params.id);
  
    // 1. find item by ID
    const item = await getItemById(itemId);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }

    // 2. access control: check if the user is the owner of the item or an admin
    const currentUserId = req.user.id;
    const isAdmin = req.user.is_admin === 1;
    const isOwner = item.sellerId === currentUserId;

     if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You can only update your own items" });
    }

    // 3. update the item
    const updatedItem = await updateItemById(itemId, req.body);
    res.json(updatedItem);
});

//delete item by ID(user who do login can do)
router.delete("/:id", requiresAuthentication, async (req, res)=>{
    const itemId = parseInt(req.params.id);
  
    // 1. find item by ID
    const item = await getItemById(itemId);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }

    // 2. access control: check if the user is the owner of the item or an admin
    const currentUserId = req.user.id;
    const isAdmin = req.user.is_admin === 1;
    const isOwner = item.sellerId === currentUserId;

     if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden: You can only update your own items" });
    }

    // 3. delete the item
    const deletedItem = await deleteItemById(itemId);
    res.json(deletedItem);
});

export default router;
