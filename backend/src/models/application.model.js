import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        // Initial application / cover letter
        message: {
            type: String,
            required: true,
            trim: true,
        },

        contact: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "VIEWED", "REJECTED", "SHORTLISTED"],
            default: "PENDING",
        },

        statusMessage:{
            type: String,
            default: null
        }

    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index(
    { jobId: 1, applicantId: 1 },
    { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
