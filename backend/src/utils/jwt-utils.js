import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY?.trim() || "uoa-swap-dev-secret";

// 1. based on email 
export function getEmailFromJWT(token) {
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        if (!decoded.email) throw new Error("JWT did not contain an email.");
        return decoded.email;
    } catch (err) {
        throw err;
    }
}

// 2. based on username
export function getUsernameFromJWT(token) {
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        if (!decoded.username) throw new Error("JWT did not contain a username.");
        return decoded.username;
    } catch (err) {
        throw err;
    }
}

export function createUserJWT(user, expiresIn = "24h") {
    
    const payload = typeof user === 'object' 
        ? { email: user.email, username: user.username } 
        : { email: user, username: user }; 

    return jwt.sign(payload, JWT_KEY, { expiresIn });
}