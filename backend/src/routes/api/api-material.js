import express from "express";
import {getAllMaterials, createMaterial,getMaterialFiltered} from "../../data/material-dao.js";
import {requiresAuthentication} from "../../middleware/auth-middleware.js";


const router= express.Router();

//Search all materials add the filter feature
router.get("/", async(req , res)=>{
    try{
        //ex. /material?course=COMPSCI732&year=2024
        const { course, year} = req.query;

        const results = await getMaterialFiltered({course, year});
        res.json(results);
    }catch(err){
        res.status(500).json({error: "Failed to fetch materials with filters"});
    }
})

//Upload new material
router.post("/", requiresAuthentication, async (req, res)=>{
    try{
        const { title, courseCode, year } = req.body;
        
        // Input validation
        if (!title?.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!courseCode?.trim()) {
            return res.status(400).json({ error: "Course code is required" });
        }
        if (year && (year < 1900 || year > 2100)) {
            return res.status(400).json({ error: "Invalid year" });
        }
        
        const newMaterial = await createMaterial({
            ...req.body,
            uploaderId: req.user.id     
        });
        res.status(201).json(newMaterial);
    }catch(err){
        res.status(400).json({error : err.message || "Failed to upload material"});
    }
});

export default router;