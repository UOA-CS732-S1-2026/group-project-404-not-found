import {findUserByUsername} from "../data/user-dao.js";
import {getUsernameFromJWT} from "../utils/jwt-utils.js";

export async function requiresAuthentication(req, res, next){
    if(!req.cookies.authToken) return res.sendStatus(401);

    try{
        const username = getUsernameFromJWT(req.cookies.authToken);
        const user = await findUserByUsername(username);
        if(!user) return res.sendStatus(401);

        req.user = user;
        return next();
    }catch{
        return res.sendStatus(401);
    }
}