import express from "express";
import {requiresAuthentication} from "../../middleware/auth-middleware.js";
import {updateMyProfile, deleteUserById} from "../../data/user-dao.js";


const router = express.Router();

//User profile
router.get("/me", requiresAuthentication, async(req, res)=>{
    const {password, ...profile} = req.user;
    res.json(profile);
});

//Modify profile
router.patch("/me", requiresAuthentication, async(req,res)=>{
    const updated = await updateMyProfile(req.user.id, req.body);
    if(!updated) return res.sendStatus(404);
    const {password, ...profile } = updated;
    res.json(profile);
});

//Delete a user by admin or self
router.delete("/:id", requiresAuthentication, async (req, res)=>{
    const id = parseInt(req.params.id);

    // Prevent non-admins from deleting others
    if(req.user.id === id || req.user.is_admin === 1){
        try{
            const success = await deleteUserById(id);
            if(success){
                return res.sendStatus(200);
            }else{
                return res.status(404).json({error : "User not found or already deleted."});
            }
        }catch(err){
            console.error(err);
            return res.status(400).json({error: "Failed to delete user."});
        }
    } else{
        return res.sendStatus(403);
    }
});

export default router;

