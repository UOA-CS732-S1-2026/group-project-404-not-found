import express from "express";
import {findUserByEmail, verifyUserPassword, createUser} from "../../data/user-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";

const router = express.Router();

//Register
router.post("/register", async (req, res)=>{
    try{
        const { email, password } = req.body;
        
        // Input validation
        if (!email?.trim()) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        
        const newUser = await createUser(req.body);
        res.status(201).json({userId : newUser.id});
    }catch(err){
        res.status(400).json({error : err.message || "Failed to register"});
    }
});

//Login
router.post("/login", async(req,res)=>{
    const {email, password}= req.body;
    const user = await findUserByEmail(email);
    if(!user) return res.status(401).json({error : "Invalid email or password"});

    const valid = await verifyUserPassword(user, password);
    if(!valid) return res.status(401).json({error : "Invalid email or password"});

    const token = createUserJWT(user.email);
    res.cookie("authToken", token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    res.json({
        message : "Logged in",
        user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar_id: user.avatar_id
        }
    });

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
