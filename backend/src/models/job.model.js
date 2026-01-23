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
    skills: {
        type: [{
            type: String,
            lowercase: true,
            trim: true
        }],
        required: true,
        set: skills =>
            Array.isArray(skills)
                ? skills.map(s => s.replace(/\s+/g, " "))
                : []
    },
    salaryRange: {
        type: String,
    required: true,
},
    employmentType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "GIG"],
        required: true,
    },
   status: {
        type: String,
        enum: ["published", "draft"],
        default: "draft"
    }

}, 
    {
        timestamps: true
    });

jobSchema.index({title: "text", description: "text", skills: "text"});

const Job = mongoose.model("Job", jobSchema);

export default Job;
