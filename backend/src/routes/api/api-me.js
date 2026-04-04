import express from "express";
import {requiresAuthentication} from "../../middleware/auth-middleware";
import {updateMyProfile} from "../../data/user-dao.js";

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

//Search my list user uploaded in marketplace

//Search my list user uploaded in material

export default router;