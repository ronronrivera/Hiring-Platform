import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

import { normalizeEmploymentType } from "../lib/utils.js";

export const postJob = async (req, res) =>{
    try {


        const user = req.user; 

        if(!user) return res.status(404).json({message: "User not found!"});

        if(!user.profile.role || user.profile.role !== "employee") return res.status(403).json({message: "Only employee can post jobs"})

        const {title, description, salaryRange, employmentType, skills,status} = req.body;

        if(!title || !description || !salaryRange || !employmentType ||!skills) return res.status(400).json({message: "All fields must be required"});


        const allowedStatus = ["draft", "published"];

        let jobStatus = "draft"; // default

        if (status) {
            const normalizedState = status.toLowerCase();
            if (!allowedStatus.includes(normalizedState)) {
                return res.status(400).json({ message: "Invalid job state" });
            }
            jobStatus = normalizedState;
        }

        const newJob = await Job.create({
            employee: req.user._id,
            title: title.trim(),
            description: description.trim(),
            skills,
            salaryRange,
            employmentType,
            status: jobStatus
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

export const getAllEmployeeJobs = async (req, res) => {
    try {
        const user = req.user;

        if (user.profile?.role !== "employee") {
            return res.status(403).json({ message: "Only employees can view their job posts" });
        }

        // Fetch jobs
        const jobs = await Job.aggregate([
            {
                $match: {
                    employee: user._id,
                },
            },
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applications",
                },
            },
            {
                $addFields: {
                    applicantCount: { $size: "$applications" },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    salary: 1,
                    status: 1,
                    applicantCount: 1,
                    createdAt: 1,
                },
            },
        ]);

        res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getAllEmployeeJobs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getEmployeeJobById = async (req, res) => {
    try {
        const {id: jobId} = req.params;
        const userId = req.user._id;

        // Only the employee who owns the job can see this
        const job = await Job.findOne({ _id: jobId, employee: userId});
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Fetch applications for this job with applicant info
        const applications = await Application.find({ jobId: jobId })
            .populate("applicantId", "profile email") 
            .select("_id subject message contact applicantId");

        res.status(200).json({ job, applications });
    } catch (error) {
        console.log("Error in getEmployeeJobById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const patchJobStatusById = async (req, res) => {
    try{

        const jobId = req.params.id;
        const userId = req.user._id;

        const {status} = req.body;
        if(!status) return res.status(400).json({message: "Status is required"});

        const user = req.user;
        if(!user) return res.status(404).json({message: "User not found!"});

        const job = await Job.findById(jobId);

        const normalizedStatus = status.toLowerCase();
        const allowedStatus = ["published", "draft"];

        if(!job) return res.status(404).json({message: "Job not found"})

        if(user.profile?.role !== "employee") return res.status(403).json({message: "Not authorized to perform this action"});


        if (!allowedStatus.includes(normalizedStatus)) {
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

        const jobs = await Job.find({status: "published"}).populate({  path: "employee",
  select: "profile.name profile.avatar profile.role"});

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
                { status: "published" },
            ]
        }).populate("employee", "profile");

        if(!job) return res.status(404).json({message: "Job not found"});

        res.status(200).json(job); 

    } catch (error) {
        console.log("Error in getJobById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const searchJob = async (req, res) => {
    try {
        const rawQuery = req.query.query;
        const rawType = req.query.employmentType;

        const query =
            typeof rawQuery === "string" ? rawQuery.trim() : "";

        const employmentType =
            typeof rawType === "string"
                ? normalizeEmploymentType(rawType)
                : null;

        const filter = {status: "published"};

        let jobs;

        if (query === "") {
            jobs = await Job.find(filter)
                .sort({ createdAt: -1 })
                .limit(30)
                .exec();
        } else {
            jobs = await Job.find({
                ...filter,
                $text: { $search: query }
            })
                .sort({ createdAt: -1 })
                .limit(30)
                .exec();
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error in searchJob controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
