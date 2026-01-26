import { ENV } from "../lib/env.js";
import { generateToken, setCookies } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js"

export const Signup = async (req, res) =>{
    const {fullname, email, password, confirmPassword} = req.body;

    try {

        if(!fullname ||!email || !password ||!confirmPassword) return res.status(400).json({message: "All fields must be required"});
            else if(password.length < 15) return res.status(400).json({message: "Password must be at least 15 characters"});
                else if (password !== confirmPassword) return res.status(400).json({message: "Passwords do not match"});

        //check if email is valid with regex;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userExist = await User.findOne({email});

        if(userExist) return res.status(400).json({message: "User already exist!"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            "profile.name": fullname
        })

        //authenticate new user
        const {accessToken, refreshToken} = generateToken(newUser._id);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            "profile.name": fullname
        })

    } catch (error) {
        console.log("Error in sign up controller", error.message);
        res.status(500).json({message: error.message});        
    }
}

export const Login = async (req, res) =>{   
    try {

        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

        const {accessToken, refreshToken} = generateToken(user._id);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            email: user.email,
            profile: user.profile
        })

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({message: "Internal Server error"});        

    }
}

export const Logout = async (_, res) => {
    try {

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({message: "Logout Successfully"});

    } catch (error) {
        console.log("Error in logout controller\n", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const refreshToken = async (req, res) =>{
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({message: "No refresh token provided"});

        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign({userId: decoded.userId}, ENV.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        
        const isProd = ENV.NODE_ENV === "production";

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.json({message: "Token refreshed successfully"});
    }
    catch(error){
        console.log("Error in refresh token controller", error.message);
        res.status(401).json({message: "Invalid or expired refresh token"});
    }
}

export const SetupProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            role,
            bio,
            preferredSalary,
            website,
            address,
            month,
            day,
            year,
            mobileNumber,
        } = req.body;
        
        const user = req.user;
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profile?.role) {
            return res.status(400).json({ message: "Profile already set. Role cannot be changed." });
        }

        if(!role) return res.status(400).json({message: "Role is required"});

        const userRole = role.toString().toLowerCase()

        if(userRole !== "employee" && userRole !== "applicant"){
            return res.status(400).json({message: "Role must be either Employee or Applicant"});
        }

        // Validate birth date
        if (!month || !day || !year) {
            return res.status(400).json({ message: "Birth date is required" });
        }

        const birthDate = new Date(year, month - 1, day);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({ message: "Invalid birth date" });
        }

        // Validate phone
        if (mobileNumber && !/^\d+$/.test(mobileNumber)) {
            return res.status(400).json({ message: "Phone number must be numeric" });
        }

        // Validate bio
        if (bio) {
            const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount < 30) {
                return res.status(400).json({ message: "Bio must contain at least 30 words" });
            }
        }

        // Handle avatar upload
        let avatarData = null;
        if (req.file) {
            if (user.profile?.avatar?.public_id) {
                await cloudinary.uploader.destroy(user.profile.avatar.public_id);
            }

            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                resource_type: "image",
            });

            avatarData = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }

        const updateData = {
            "profile.role": userRole,
            "profile.bio": bio,
            "profile.preferredSalary": preferredSalary,
            "profile.website": website,
            "profile.address": address,
            "profile.mobileNumber": mobileNumber,
            "profile.birthDate": {
                year,
                month,
                day,
            },
            ...(avatarData && { "profile.avatar": avatarData }),
        };

        // Update user and return new document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password"); // exclude password

        res.status(200).json({
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in setup profile controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getProfile = (req, res) =>{
    try{
        res.json(req.user);
    }
    catch(error){
        console.log("Error in getProfile controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


