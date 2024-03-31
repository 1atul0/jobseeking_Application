import mongoose from "mongoose";
import validator from "validator";


const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [5, "Name must be at least 5 characters long"],
        maxLength: [40, "Name must not be more than 40 characters long"]
    },
    email: {
        type: String,
        validator: [validator.isEmail, "Please enter a valid email address"],
        required: [true, "Please enter your email address"]
    },
    coverLetter: {
        type: String,
        required: [true, "Please enter a cover letter"],
    },
    phone: {
        type: Number,
        required: [true, "Please enter your phone number"],
        minLength: [10, "Phone number must be at least 10 characters long"],
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    jobId:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    applicantId: {
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"
        },
        role: {
            type: String,
            enum: ["Job Seeker"],
            required: true
        }
    },
    employerId: {
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"

        },
        role: {
            type: String,
            enum: ["Employer"],
            required: true
        }
    }

});
const Application = mongoose.model("Application", applicationSchema);
export default Application;