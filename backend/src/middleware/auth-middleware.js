import { findUserByUsername, findUserByEmail } from "../data/user-dao.js"; // findUserByEmail 추가
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY?.trim() || "uoa-swap-dev-secret";

export async function requiresAuthentication(req, res, next) {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.sendStatus(401);
    }

    try {
      
        const decoded = jwt.verify(token, JWT_KEY);
        let user = null;

     
        if (decoded.username) {
            user = await findUserByUsername(decoded.username);
        } else if (decoded.email) {
            user = await findUserByEmail(decoded.email);
        }

        if (!user) {
            return res.sendStatus(401);
        }

    
        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication Failed:", err.message || err);
        return res.sendStatus(401);
    }
}