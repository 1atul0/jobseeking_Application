import Job from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Joi from "joi";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs
    });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("You are not authorized to post a job", 403));
    }
    const jobSchema = Joi.object({
        title: Joi.string().required().min(5).max(100),
        description: Joi.string().required().min(20).max(300),
        category: Joi.string().required().valid("Information Technology", "Healthcare", "Education", "Finance", "Business", "Others"),
        country: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required().min(10).max(100),
        fixedSalary: Joi.number().min(1000).max(1000000000),
        salaryFrom: Joi.number().min(1000).max(1000000000),
        salaryTo: Joi.number().min(1000).max(1000000000),
        user: Joi.required()
    })
        .xor("fixedSalary", "salaryFrom")
        .xor("fixedSalary", "salaryTo")
        .with("salaryFrom", "salaryTo")
        .with("salaryTo", "salaryFrom")
        .xor("salaryFrom", "fixedSalary")
        .xor("salaryTo", "fixedSalary");
    const { value, error } = jobSchema.validate(req.body, { stripunknown: true });
    if (error) {
        return next(new ErrorHandler(error.details.map(err => err.message).join(","), 400));
    }
    const job = await Job.create(value);
    res.status(200).json({
        success: true,
        job,
        message: "Job posted successfully"
    });


});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("You are not authorized to view this page", 403));
    }
    const myJobs = await Job.find({ jobPostedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs
    });
})

export const updateJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("You are not authorized to update a job", 403));
    }
    const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if(job.jobPostedBy.ObjectId!==req.user._id.ObjectId){
        return next(new ErrorHandler("You are not authorized to update this job",403));
    }
    const updateJob = Joi.object({
        title: Joi.string().min(5).max(100),
        description: Joi.string().min(20).max(300),
        category: Joi.string().valid("Information Technology", "Healthcare", "Education", "Finance", "Business", "Others"),
        country: Joi.string(),
        city: Joi.string(),
        address: Joi.string().min(10).max(100),
        fixedSalary: Joi.number().min(1000).max(1000000000),
        salaryFrom: Joi.number().min(1000).max(1000000000),
        salaryTo: Joi.number().min(Joi.ref('salaryFrom')).max(1000000000),
        expired: Joi.boolean(),
    }).xor("fixedSalary", "salaryFrom")
    .with("salaryFrom", "salaryTo") 
    .with("salaryTo", "salaryFrom");
    const { value, error } = updateJob.validate(req.body, { abortEarly: false }, { stripunknown: true });
    if (error) {
    return next(new ErrorHandler(error.details.map(err => err.message).join(","), 400));
    }
    job = await Job.findByIdAndUpdate(id, value, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({
        success: true,
        job,
        message: "Job updated successfully"
    })
})

export const deleteJob=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user;
    if(role==="Job Seeker"){
        return next(new ErrorHandler("You are not authorized to delete a job",403));
    }
    const {id}=req.params;
    let job=await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Job not found",404));
    }
    console.log(job.jobPostedBy,req.user._id);
    if(job.jobPostedBy.ObjectId!==req.user._id.ObjectId){ 
        return next(new ErrorHandler("You are not authorized to delete this job",403));
    }
    job=await Job.findByIdAndDelete(id);
    res.status(200).json({
        success:true,
        message:"Job deleted successfully"
    })
})