import { findUserByUsername, findUserByEmail } from "../data/user-dao.js"; // findUserByEmail 추가
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY?.trim() || "uoa-swap-dev-secret";

export async function requiresAuthentication(req, res, next) {
    const token = req.cookies?.authToken;
    if (!token) {
        console.log("❌ [Auth] 쿠키에 토큰이 없습니다.");
        return res.sendStatus(401);
    }

    try {
      
        const decoded = jwt.verify(token, JWT_KEY);
        console.log("🎫 [Debug] 토큰 내용:", decoded);
        let user = null;

     
        if (decoded.username) {
            console.log("🔍 [Debug] 유저네임으로 찾는 중:", decoded.username);
            user = await findUserByUsername(decoded.username);
        } else if (decoded.email) {
            console.log("🔍 [Debug] 이메일로 찾는 중:", decoded.email);
            user = await findUserByEmail(decoded.email);
        }

        if (!user) {
            console.log("❌ [Auth] DB 조회 결과가 없습니다. (유저 찾기 실패)");
            console.log("❌ [Auth] 토큰은 맞지만 DB에 유저가 없습니다.");
            return res.sendStatus(401);
        }

    
        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication Failed:", err.message || err);
        return res.sendStatus(401);
    }
}