import { catchAsyncError } from "./catchAsyncError.js" 
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
export const isAuthorized=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to access this resource or work",401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id);
    next();

});