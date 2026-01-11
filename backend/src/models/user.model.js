import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 15,
    },
    role: {
        type: String,
        enum: ["applicant", "employee", "admin"],
    },
    profile:{
        name: {
            type: String,
            default: "",
        },
        avatar: {
            public_id: String,
            url: String
        },
        preferredSalary: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: ""
        },
        birthDate: {
            year: {
                type: Number,
                default: "",
            },
            month: {
                type: Number,
                default: "",
            },
            day: {
                type: Number,
                default: "",
            }
        },
        mobileNumber: {
            type: String,
            default: "",
        },
        bio:{
            type: String,
            default: "",
        }

    }
},
    {
        timestamps: true,
    });

const User = mongoose.model("User", userSchema);

export default User;
