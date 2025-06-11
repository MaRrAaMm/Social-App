import jwt from "jsonwebtoken";
import { User } from "../db/models/user.model.js";
import { verifyToken } from "../utils/index.js";
export const isAuthenticate = async ( req, res, next)=>{
    try {
        // get data from req
     const {authorization} = req.headers;
     if(!authorization) 
        return res.status(400).json({
            success: false,
            message: "token is required",
        });
     if(!authorization.startsWith("Bearer "))
        return res.status(400).json({
            success: false,
            message: "invalid bearer key",
        });
     const token = authorization.split(" ")[1];
     //check token
     const result = verifyToken({token});
     if(result.error) return next(result.error);
     const userExist = await User.findOne({email: result.email});
     if(!userExist)return next(new Error("invalid email", {cause:404}));
   
    // pas data of user to req
    if(userExist.isDeleted == true)
        return next(new Error("login first", {cause:400}));
    
    if(userExist.deletedAt && userExist.deletedAt.getTime() > iat * 1000)
        return next(new Error("destroyed token",{cause:400}))
    req.authUser = userExist;
    // if exist
    return next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }    
};