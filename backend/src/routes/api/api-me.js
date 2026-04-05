import express from "express";
import {requiresAuthentication} from "../../middleware/auth-middleware.js";
import {deleteUserById, updateMyProfile} from "../../data/user-dao.js";
import {getMaterialById, deleteMaterialById,updateMaterialById,getMaterialByUploaderId} from "../../data/material-dao.js";
import {getItemBysellerId ,updateItemById, deleteItemById, getItemById} from "../../data/marketplace-dao.js";

const router = express.Router();

router.use(requiresAuthentication);

//User profile
router.get("/", requiresAuthentication, async(req, res)=>{
    const {password, ...profile} = req.user;
    res.json(profile);
});

//Modify profile
router.patch("/", requiresAuthentication, async(req,res)=>{
    try{
    const updated = await updateMyProfile(req.user.id, req.body);
    if(!updated) return res.sendStatus(404);
    const {password, ...profile } = updated;
    res.json(profile);
    }catch(err){
        res.status(400).json({error: "Update failed"});
    }                                                                                                                             
});

//Delete user self
router.delete("/", requiresAuthentication, async(req, res)=>{
    try{
        const success = await deleteUserById(req.user.id);
        if(success){
            res.clearCookie("authToken");
            return res.sendStatus(204);
        }
        return res.sendStatus(404);
    }catch(err){
        res.status(500).json({error: "Failed to withdraw."});
    }
})

//Search my list user uploaded in marketplace
router.get("/marketplace", async (req, res)=>{
    try{
        const myItems = await getItemBysellerId(req.user.id);
        res.json(myItems);
    }catch(err){
        res.status(500).json({error: "Failed to fetch your marketplace items"});
    }
});

//Patch my list user uploaded in marketplace
router.patch("/marketplace/:id", async(req, res)=>{
    const itemId = parseInt(req.params.id);
    const item = await getItemById(itemId);

    if(!item) return res.statusCode(404).json({error : "Item not found"});

    //Check user(sellerId)
    if(item.sellerId !== req.user.id){
        return res.status(403).json({error : "You can only update your own items."});
    }

    try{
        const updated = await updateItemById(itemId, req.body);
        res.json(updated);
    }catch(err){
        res.status(400).json({error : "Update failed"});
    }
})

//Delete my list user uploaded in marketplace
router.delete("/marketplace/:id", async(req,res)=>{
    const itemId = parseInt(req.params.id);
    const item = await getItemById(itemId);

    if(!item) return res.status(404).json({error:"Item not found" });

    //Check user(sellerId)
    if(item.sellerId !== req.user.id){
        return res.status(403).json({error: "You can only delete your own items."});
    }

    const success = await deleteItemById(itemId);
    if(success) res.sendStatus(204);
    else res.status(500).json({error: "Delete failed"});''
})

//Search my list user uploaded in material
router.get("/material", async(req, res)=>{
    try{
        const myUserId = req.user.id;
        const myMaterials = await getMaterialByUploaderId(myUserId);

        res.json(myMaterials);
    }catch(err){
        res.status(500).json({error : "Fail to bring materials"});
    }
})
//Delete my list user uploaded in material
router.delete("/material/:id", requiresAuthentication, async(req, res)=>{
    const materialId = parseInt(req.params.id);
    const material = await getMaterialById(materialId);

    if(!material) return res.status(404).json({error : "Material not found" });

    //Check whether upLoaderId and userId are matching
    if(material.uploaderId !== req.user.id){
        return res.status(403).json({error: "You can only delete your own materials."});
    }

    await deleteMaterialById(materialId);
    res.sendStatus(204); //Success delete
})

//Patch my list user uploaded in material
router.patch("/material/:id", requiresAuthentication, async(req, res)=>{
    const materialId = parseInt(req.params.id);
    const material = await getMaterialById(materialId);

    //if there is no material
    if(!material) return res.status(404).json({error: "Material not found"});

    //Check whether user and user's material are matching
    if(material.uploaderId !== req.user.id){
        return res.status(403).json({error:"You can only update your own materials." });
    }

    try{
        //update
        const updated = await updateMaterialById(materialId, req.body);
        res.json(updated);
    }catch(err){
        res.status(400).json({error:"Update failed" });
    }
})

export default router;