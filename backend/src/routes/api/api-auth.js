import express from "express";
import {findUserByUsername, verifyUserPassword, createUser} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";

const router = express.Router();

//Sign up
router.post("/register", async (req, res)=>{
    try{
        const newUser = await createUser(req.body);
        res.status(201).json({userId : newUser.id});
    }catch(err){
        res.status(400).json({error : "Failed to register"});
    }
});

//Login
router.post("/login", async(req,res)=>{
    const {username, password}= req.body;
    const user = await findUserByUsername(username);
    if(!user) return res.status(401).json({error : "Invalid username or password"});

    const valid = await verifyUserPassword(user, password);
    if(!valid) return res.status(401).json({error : "Invalid username or password"});

    const token = createUserJWT(username);
    res.cookie("authToken", token, {httpOnly: true});
    res.json({message : "Logged in"});

});

//Lougout : clear the authToken cookie
router.post("/logout", (req, res)=>{

    console.log("cookies:" , req.cookies);
    const expires = new Date(0);// Expire the cookie immediately
    return res
        .cookie("authToken", "", {httpOnly: true, expires })// Clear the cookie
        .sendStatus(204);// No content
})


export default router;