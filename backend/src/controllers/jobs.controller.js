import Job from "../models/job.model.js";

export const postJob = async (req, res) =>{
    try {
        
        
        const user = req.user; 

        if(!user) return res.status(404).json({message: "User not found!"});

        if(!user.profile.role || user.profile.role !== "employee") return res.status(403).json({message: "Only employee can post jobs"})

        const {title, description, salaryRange, employmentType, states} = req.body;

        if(!title || !description || !salaryRange || !employmentType) return res.status(400).json({message: "All fields must be required"});
    

        const allowedStates = ["draft", "published"];

        let jobStates = "draft"; // default

        if (states) {
            const normalizedState = states.toLowerCase();
            if (!allowedStates.includes(normalizedState)) {
                return res.status(400).json({ message: "Invalid job state" });
            }
            jobStates = normalizedState;
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

export const getAllEmployeeJobs = async (req, res) =>{
    try {
        
        const user = req.user;
        const userId = req.user._id;

        if(!user) return res.status(404).json({message: "User not found!"});

        if(user.profile?.role !== "employee") return res.status(403).json({message: "Only employees can view their job posts"});

        const jobs = await Job.find({employee: userId ,states: "published", status: "OPEN"});

        res.status(200).json(jobs);

    } catch (error) {
        console.log("Error in fetchAllJobs: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getEmployeeJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findOne({
            _id: jobId,
            $or: [
                { states: "published" },
                { employee: req.user._id }
            ]
        });

        if(!job) return res.status(404).json({message: "Job not found"});

        res.status(200).json(job); 

    } catch (error) {
        console.log("Error in getJobById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const patchJobStatusById = async (req, res) => {
    try{

        const jobId = req.params.id;
        const userId = req.user._id;

        const {status} = req.body;
        if(!status) return res.status(400).json({message: "Status is required"});

        const user = req.user;
        if(!user) return res.status(404).json({message: "User not found!"});

        const job = await Job.findById(jobId);

        const normalizedStatus = status.toUpperCase();
        const allowedStatuses = ["OPEN", "CLOSE"];

        if(!job) return res.status(404).json({message: "Job not found"})

        if(user.profile?.role !== "employee") return res.status(403).json({message: "Not authorized to perform this action"});


        if (!allowedStatuses.includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (job.employee.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only update your own jobs" });
        }

        await Job.findByIdAndUpdate(
            jobId,
            { status: normalizedStatus },
            { new: true }
        );

        res.status(200).json({message: "Job status updated successfully"});
    }
    catch(error){
        console.log("Error in patchJobStatusById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getAllJobs = async (_, res) =>{
    try {
        
        const jobs = await Job.find({states: "published", status: "OPEN"});

        res.status(200).json(jobs);

    } catch (error) {
        console.log("Error in fetchAllJobs: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findOne({
            _id: jobId,
            $or: [
                { states: "published" },
            ]
        });

        if(!job) return res.status(404).json({message: "Job not found"});

        res.status(200).json(job); 

    } catch (error) {
        console.log("Error in getJobById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}
