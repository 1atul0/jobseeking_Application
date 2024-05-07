import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Application from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import Job from "../models/jobSchema.js";
import Joi from "joi";
export const employerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job seekers are not authorized to view this page", 403));
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
        success: true,
        applications
    });

});
export const jobSeekerGetAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer are not authorized to view this page", 403));
    }
    const { _id } = req.user;
    // console.log(_id);
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
        success: true,
        applications
    });

});
export const jobSeekerDeleteApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer are not authorized to view this page", 403));
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler("No applications found", 404));
    }
    await Application.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Application deleted successfully"
    });

});

export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer are not authorized to view this page", 403));
    }
    const applicationSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        coverLetter: Joi.string().required(),
        phone: Joi.number().required(),
        address: Joi.string().required(),
        jobId: Joi.string().required()
    });
    const { name, email, coverLetter, phone, address, jobId } = req.body;

    const { error } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(item => item.message);
        return next(new ErrorHandler(errors, 400));
    }

    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found!", 400));
    }

    // add feature of already applied for this job
    // console.log(jobId, req.user._id);
    const existingApplication = await Application.findOne({ jobId, "applicantId.user": req.user._id });
    if (existingApplication) {
        return res.status(200).json({
            message: "You have already applied for this job",
            existingApplication,
            success: true,
        });
    }

    if (!req.files || Object.keys(req.files).length === 0)
        return next(new ErrorHandler("Please upload your resume", 400));
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype))
        return next(new ErrorHandler("invlalid file type. Please upload a png,jpg,webp format file", 400));
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("cloudinary errpr", cloudinaryResponse.error || "unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload resume", 500));
    }



    const applicantId = {
        user: req.user._id,
        role: req.user.role
    };

    const employerId = {
        user: job.jobPostedBy,
        role: "Employer"
    };
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        },
        applicantId,
        employerId,
        jobId
    });
    res.status(200).json({
        success: true,
        application,
        message: "Application submitted successfully"
    });

});
