import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";


const protectRoute = async  (req, res, next) =>{
    try{
        const token = req.cookies.accessToken;

        if(!token) return res.status(401).json({message: "Unauthorized"});
        
        const decode = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

        if(!decode) return res.status(401).json({message: "Unauthorized - Invalid token"});
        
        const user = await User.findById(decode.userId).select("-password");

        if(!user) return res.status(401).json({message: "User not found"});

        req.user = user;

        next();
    }
    catch(error){
        console.log("Error in protectRoute\n", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
export default protectRoute;
