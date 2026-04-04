//Only for admin

import express from "express";
import {requiresAuthentication} from "../../middleware/auth-middleware.js";
import {isAdmin} from "../../middleware/admin-middleware.js";
import {deleteUserById, users} from "../../data/user-dao.js";


const router = express.Router();

//Search all user list for admin(GET/api/users)
router.get("/", requiresAuthentication, isAdmin, async(req,res)=>{
    const safeUsers = users.map(({password, ...u})=>u);
    res.json(safeUsers);

})

//Delete a user by admin
router.delete("/:id", requiresAuthentication, isAdmin, async (req, res)=>{
    const id = parseInt(req.params.id);

    try{
        const success = await deleteUserById(id)
        if(success){
            return res.sendStatus(204);
        }else{
            return res.status(404).json({error: "User not found."});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({error: "Internal server error during deletion"});
    }
});

export default router;

