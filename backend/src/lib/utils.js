import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import { streamServer } from "./stream.js";
import User from "../models/user.model.js";


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

export const setCookies = (res, accessToken, refreshToken) => {
    const isProd = ENV.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,            // must be true in production
        sameSite: isProd ? "none" : "lax", // <-- "none" for cross-origin
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const normalizeEmploymentType = (value) =>
    value.replace(/[\s_-]/g, "").toUpperCase();



export const ensureStreamUser = async (user) => {
    await streamServer.upsertUser({
        id: user._id.toString(),
        name: user.name || "User",
        image: user.avatar || undefined,
    });
};


export const createApplicationChat = async (
    applicationId,
    applicantId,
    employeeId
) => {
    const channelId = `app_${applicationId}`;

    const [applicant, employee] = await Promise.all([
        User.findById(applicantId),
        User.findById(employeeId),
    ]);

    if (!applicant || !employee) {
        throw new Error("Applicant or employee not found");
    }


    await ensureStreamUser(applicant);
    await ensureStreamUser(employee);

    const channel = streamServer.channel("messaging", channelId, {
        members: [applicantId.toString(), employeeId.toString()],
        created_by_id: employeeId.toString(),
    });

    await channel.create();

    return channelId;
};
