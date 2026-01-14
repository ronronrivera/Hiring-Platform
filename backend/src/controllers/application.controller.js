import Application from "../models/application.model.js";
import Job from "../models/job.model.js";


export const sendApplication = async (req, res) =>{
    try {
        
        const {subject, message} = req.body; 
        const jobId = req.params.id;
        const user = req.user;

        const job = await Job.findById(jobId);
        
        const alreadyApplied = await Application.findOne({
            applicantId: user._id,
            jobId
        });

        if(!subject || !message) return res.status(400).json({message: "All fields are required"});
        if(user.profile?.role !== "applicant") return res.status(403).json({message: "Only applicant can apply for a job"});
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
    try {

        const applicationId = req.params.id;
        const user = req.user;

        const application = await Application.findById(applicationId).populate("jobId", "title description salary"); 

        if(!application) return res.status(404).json({})
        if(user.profile?.role !== "applicant") return res.status(403).json({message: "Only applicant can read application"});
        if(application.applicantId.toString() !== user._id.toString()) return res.status(403).json({ message: "You can only read your own application" });
        
        res.status(200).json(application);

    } catch (error) {
        console.log("Error in readApplication controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const allApplications = async (req, res) => {

    try {
        const user = req.user;

        if(user.profile?.role !== "applicant") 
            return res.status(403).json({ message: "Only applicants can view their applications" });
        
        const applications = await Application.find({ applicantId: user._id })
            .populate("jobId", "title description salary"); // include job details

        res.status(200).json(applications);

    } catch (error) {
        console.log("Error in allApplications controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

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
