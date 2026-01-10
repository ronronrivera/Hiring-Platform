import { ENV } from "../lib/env.js";
import { generateToken, setCookies } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export const Signup = async (req, res) =>{
    const {email, password, confirmPassword} = req.body;

    try {
       
        if(!email || !password ||!confirmPassword) return res.status(400).json({message: "All fields must be required"});
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
            password: hashedPassword
        })
       
        //authenticate new user
        const {accessToken, refreshToken} = generateToken(newUser._id);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
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
        })

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: error.message});        

    }
}

export const Logout = async (req, res) => {
    try {
       
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({message: "Logout Successfully"});

    } catch (error) {
        console.log("Error in logout controller\n", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

