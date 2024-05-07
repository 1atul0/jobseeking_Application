import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please enter job title"],
        minLength:[3,"Job Title must be atleast 3 characters long"],
        maxLength:[100,"Job Title cannot exceed 100 characters long"]
    },
    description:{
        type:String,
        required:[true,"Please enter job description"],
        minLength:[20,"Job Description must be atleast 10 characters long"],
        maxLength:[300,"Job Description cannot exceed 1000 characters long"]
    },
    category:{
        type:String,
        required:[true,"Please enter job category"],
        enum:["Information Technology","Healthcare","Education","Finance","Business","Others"] 
    },
    country:{
        type:String,
        required:[true,"Please enter country"]
    },
    city:{
        type:String,
        required:[true,"Please enter city"]
    },
    address:{
        type:String,
        required:[true,"Please enter address"],
        minLength:[10,"Address must be atleast 10 characters long"],
        maxLength:[100,"Address cannot exceed 100 characters long"]
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"Fixed salasy must be atleast 4 digits long"],
        maxLength:[9,"Fixed Salary cannot exceed 10 digits long"],
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"Salary  must be atleast 4 digits long"],
        maxLength:[9,"Salary  cannot exceed 10 digits long"],
    },
    salaryTo:{
        type:Number,
        minLength:[4,"Salary must be atleast 4 digits long"],
        maxLength:[9,"Salary cannot exceed 10 digits long"],
    },
    expired:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }


    
});

const Job=mongoose.model("Job",jobSchema);
export default Job;