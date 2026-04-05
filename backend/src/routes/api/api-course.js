import express from "express";
import {getAllCourses, getCourseBySearch} from "../../data/course-dao.js";

const router = express.Router();

//All user can see the course list
router.get("/", async(req ,res)=>{
    try{
        const list = await getAllCourses();
        res.json(list);
    }catch(err){
        res.status(500).json({error: "Failed to load courses" });
    }
});

//user can search course using code such COMPSCI732
router.get("/:code", async(req, res)=>{
    try{
        const results = await getCourseBySearch(req.params.code);
        
        res.json(results);
        
    }catch(err){
        res.status(500).json({ error: "Error searching course" });
    }
});

export default router;