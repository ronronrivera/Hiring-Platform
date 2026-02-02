import { createApplicationChat } from "../lib/utils.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { ENV } from "../lib/env.js";
import { streamServer } from "../lib/stream.js";

export const debugApplications = async (req, res) => {
    try {
        const allApps = await Application.find({});
        res.json({
            total: allApps.length,
            applications: allApps.map(app => ({
                _id: app._id.toString(),
                status: app.status,
                applicantId: app.applicantId.toString(),
                jobId: app.jobId.toString(),
                createdAt: app.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const sendApplication = async (req, res) =>{
    try {

        const {subject, message} = req.body; 
        const jobId = req.params.id;
        const user = req.user;

        if(!subject || !message) return res.status(400).json({message: "All fields are required"});
        if(user.profile?.role !== "applicant") return res.status(403).json({message: "Only applicant can apply for a job"});

        const job = await Job.findById(jobId);

        const alreadyApplied = await Application.findOne({
            applicantId: user._id,
            jobId
        });
        if(!job) return res.status(404).json({message: "Job not found"});    
        if (alreadyApplied) return res.status(400).json({ message: "You already applied to this job" });

        const application = await Application.create({
            jobId,
            applicantId: user._id,
            subject,
            message,
            contact: req.user.email
        })

        res.status(201).json({
            message: "Application created successfully",
            application,
            applied: true
        });

    } catch (error) {
        console.log("Error in sendApplication controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
} 

export const readApplication = async (req, res) => {

    /*BOTH ROLE MUST BE ABLE TO ACESS THIS ENDPOINT*/
    /*WHEN AN EMPLOYEE OPEN THE APPLICATION,THE STATUS WILL ChANGE TO VIWED, IT'LL CHANGE IF THE EMPLOYEE EXPLICITLY CHANGES IT TO REJECTED OR SHORTLISTED WITH MESSAGE*/
    try {
        const applicationId = req.params.id;
        const user = req.user;
        
        const application = await Application.findById(applicationId)
            .populate("applicantId", "email profile")
            .populate({
                path: "jobId",
                select: "title employee",
                populate: {
                    path: "employee",
                    select: "profile email avatar"                 }
            });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const isApplicant =
            application.applicantId._id.toString() === user._id.toString();

        const isEmployee =
            application.jobId.employee._id.toString() === user._id.toString();

        if (!isApplicant && !isEmployee) {
            return res.status(403).json({
                message: "You are not authorized to view this application",
            });
        }

        if(isEmployee && application.status === "PENDING"){
            application.status = "VIEWED";
            await application.save();
        }

        res.status(200).json(application);

    } catch (error) {
        console.log("Error in readApplication controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const allApplications = async (req, res) => {

    /*ONLY APPLICANT CAN SEE ALL THE APPLICATIONS HE SEND*/

    try {
        const user = req.user;

        if(user.profile?.role !== "applicant") 
            return res.status(403).json({ message: "Only applicants can view their applications" });

        const applications = await Application.find({ applicantId: user._id })
            .populate("jobId", "title description salary") // include job details
            .select("-messages");


        res.status(200).json(applications);

    } catch (error) {
        console.log("Error in allApplications controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessageToApplication = async (req, res) => {
    try {
        const user = req.user;
        const { id: applicationId } = req.params;
        const { status, message } = req.body;

        const application = await Application.findById(applicationId)
            .populate("jobId");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const isEmployee =
            application.jobId.employee.toString() === user._id.toString();

        const isApplicant =
            application.applicantId.toString() === user._id.toString();

        // Only allow employees or applicants to update the application
        if (!isEmployee && !isApplicant) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Define allowed statuses per role
        let allowedStatus = [];
        if (isEmployee) {
            // Employees cannot set "WITHDRAWN"
            allowedStatus = ["REJECTED", "SHORTLISTED"];
        } else if (isApplicant) {
            // Applicants can set "WITHDRAWN"
            allowedStatus = ["WITHDRAWN"];
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status for your role" });
        }

        // Only require message if employee is shortlisting
        if (status === "SHORTLISTED" && isEmployee && !message) {
            return res.status(400).json({
                message: "Message required when shortlisting",
            });
        }

        application.status = status;
        application.statusMessage = message || null;
        application.statusUpdatedAt = new Date();

        if(
            status === "SHORTLISTED" &&
            isEmployee &&
            !application.chatChannelId
        )
        {
            const channelId = await createApplicationChat(
                application._id.toString(),
                application.applicantId.toString(),
                application.jobId.employee.toString()
            );

            application.chatChannelId = channelId;
        }

        await application.save();
        res.json({
            status: application.status,
            statusMessage: application.statusMessage,
            chatEnabled: !!application.chatChannelId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkExistingApplication = async (req, res) => {
    try {
        const {jobId} = req.params;
        const userId = req.user._id;

        const application = await Application.findOne({
            jobId,
            applicantId: userId,
        }).select("_id status");

        res.json({
            applied: !!application,
        });


    } catch (error) {
        console.error("Error in checkIfApplied:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
}


export const streamChat = async (req, res) =>{
    try {
        const userId = req.user._id;
        const applicationId = req.params.id;
        
        
        const application = await Application.findById(applicationId)
            .populate({
                path: "jobId",
                select: "employee",
                populate: {
                    path: "employee",
                    select: "_id"
                }
            });


        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.status !== "SHORTLISTED") {
            return res.status(403).json({ message: "Chat not enabled" });
        }

        const isParticipant =
            application.applicantId.toString() === userId.toString() ||
                application.jobId.employee._id.toString() === userId.toString();

        if (!isParticipant) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const token = streamServer.createToken(userId.toString());

        res.json({
            token,
            channelId: application.chatChannelId,
        });
    } catch (error) {
        console.error("Error in streamChat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

