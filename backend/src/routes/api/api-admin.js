//Only for admin

import express from "express";
import {requiresAuthentication} from "../../middleware/auth-middleware.js";
import {isAdmin} from "../../middleware/admin-middleware.js";
import {deleteUserById, users} from "../../data/user-dao.js";
import {deleteMaterialById} from "../../data/material-dao.js";
import {deleteItemById} from "../../data/marketplace-dao.js"
import {createCourse, deleteCourseById} from "../../data/course-dao.js";


const router = express.Router();

router.use(requiresAuthentication);
router.use(isAdmin);

//Search all user list for admin(GET/users)
router.get("/users", async(req,res)=>{
    const safeUsers = users.map(({password, ...u})=>u);
    res.json(safeUsers);

})

//Delete a user by admin
router.delete("/users/:id",async (req, res)=>{
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

//Delete user's material by admin
router.delete("/materials/:id", async(req, res)=>{
    const materialId = parseInt(req.params.id);
    const success = await deleteMaterialById(materialId);

    if(success){
        res.sendStatus(204);
    }else{
        res.status(404).json({error: "Material not found"});
    }
})

//Delete user's items in the marketplace by admin
router.delete("/marketplace/:id",async(req,res)=>{
    const itemId = parseInt(req.params.id);

    try{
        const success = await deleteItemById(itemId);
        
        if(success){
            res.sendStatus(204);
        }else{
            res.status(404).json({error: "Marketplace item not found"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error during marketplace deletion" });
    }
});

//Add course info
router.post("/course", async(req, res)=>{
    try{
        const newCourse = await createCourse(req.body);
        res.status(201).json(newCourse);
    }catch(err){
        res.status(400).json({ error: "Failed to create course" });
    }
});

//Delete course info
router.delete("/course/:id", async(req,res)=>{
    const id = parseInt(req.params.id);
    try{
        const success = await deleteCourseById(id);
        if(success){
            res.sendStatus(204);
        }else{
            res.status(404).json({error: "Course not found"});
        }
    }catch(err){
        res.status(500).json({ error: "Failed to delete course" });
    }
});


export default router;

