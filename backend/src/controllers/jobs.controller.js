import Job from "../models/job.model.js";
import User from "../models/user.model.js";

export const postJob = async (req, res) =>{
    try {
        
        const userId = req.user._id;
        
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({message: "User not found!"});

        if(!user.profile.role || user.profile.role !== "employee") return res.status(403).json({message: "Not authorized to perform this action"})

        const {title, description, salaryRange, employmentType, states} = req.body;
        let jobStates = "";

        if(!title || !description || !salaryRange || !employmentType) return res.status(400).json({message: "All fields must be required"});
        if(states){
            jobStates = states.toLowerCase();  
        }       

        const newJob = await Job.create({
            employee: req.user._id,
            title: title.trim(),
            description: description.trim(),
            salaryRange,
            employmentType,
            states: jobStates
        });     
        res.status(201).json(newJob);

    } catch (error) {
        console.log("Error in postJob controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteJobById = async (req, res) =>{
    try {

        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if(!job) return res.status(404).json({message: "Job not found"});

        if(job.employee.toString() !== req.user._id.toString()) return res.status(403).json({message: "Not authorized to perform this action"});

        await Job.findByIdAndDelete(jobId);

        res.status(200).json({message: "Job deleted Successfully"});


    } catch (error) {
        console.log("Error in deleteJob controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getAllJobs = async (req, res) =>{
    try {

        const jobs = await Job.find({states: "published"});

        res.status(200).json(jobs);

    } catch (error) {
        console.log("Error in fetchAllJobs: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if(!job) return res.status(404).json({message: "Job not found"});

        res.status(200).json(job); 

    } catch (error) {
        console.log("Error in getJobById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}


