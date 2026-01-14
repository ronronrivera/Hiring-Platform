import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salaryRange: {
        type: String,
        required: true,
    },
    employmentType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "GIG"],
        required: true
    },
    status:{
        type: String,
        enum: ["OPEN", "CLOSED"],
        default: "OPEN",
    },
    states: {
        type: String,
        enum: ["published", "draft"],
        default: "draft"
    }

}, 
{
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
