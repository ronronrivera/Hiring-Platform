import User from "../models/user.model.js";

const checkProfileSetup = async (req, res, next) => {
    try{
        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user || !user.profile || !user.profile.role){
            return res.status(403).json({message: "You must complete your profile before performing this action"});
        }

        next();
    }
    catch(error){
        console.error("Error in checkProfileSetup middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default checkProfileSetup;

