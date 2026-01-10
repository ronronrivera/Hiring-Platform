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
            type: String,
            default: ""
        },
        prefferedSalary: {
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
        age: {
            type: String,
            default: ""
        },
        mobileNumber: {
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
