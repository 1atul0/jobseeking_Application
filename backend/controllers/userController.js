import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js"
import {sendToken} from "../utils/jwtToken.js"
import Joi from "joi";
export const register = catchAsyncError(async (req, res, next) => {
    const userSchema = Joi.object({
        name:Joi.string().required().min(5).max(100),
        email:Joi.string().required().email(),
        phone:Joi.number().required(),
        password:Joi.string().required().min(8).max(32),
        role:Joi.string().required().valid("Job Seeker","Employer"),
        
    });

    const {value,error}=userSchema.validate(req.body,{abortEarly:false},{stripunknown:true});
    if(error){
        return next(new ErrorHandler(error.details.map(err=>err.message).join(","),400));
    }
    const {name,email,phone,password,role}=value;
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email already exists", 400));

    }
    const user=await User.create({name,email,phone,password,role});
    sendToken(user,200,res,"User registered successfully");
});

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req. body;
    if(!email||!password || !role){
        return next(new ErrorHandler("Please enter email,password and role",400));
    };
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password ",401));
    }
    const isPassword=await user.comparePassword(password);
    if(!isPassword){
        return next(new ErrorHandler("Invalid email or  password",401));
    }
    if(user.role!==role){
        return next(new ErrorHandler("Invalid role",401));
    }
    sendToken(user,200,res,"User logged in successfully!");
})

export const logout=catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logged out successfully!"
    })
})

export const getUser=catchAsyncError((req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user
    })
})