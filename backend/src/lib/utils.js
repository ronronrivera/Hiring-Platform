import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId) =>{
    
    if(!ENV.ACCESS_TOKEN_SECRET || !ENV.REFRESH_TOKEN_SECRET){
        console.log("ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET was not defined");
    }

    const accessToken = jwt.sign({userId}, ENV.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({userId}, ENV.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    
    return {accessToken, refreshToken};
}

export const setCookies = (res, accessToken, refreshToken) =>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent xss attack, cross site scripting attack
        secure: ENV.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attack, cross site request forgery attack
        maxAge: 15 * 60 * 1000,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent xss attack, cross site scripting attack
        secure: ENV.NODE_ENV === "production",
        sameSite: "strict", //prevent CSRF attack, cross site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export const normalizeEmploymentType = (value) =>
  value.replace(/[\s_-]/g, "").toUpperCase();
