import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import applicationRouter from "./routes/applicationRouter.js"
import jobRouter from "./routes/jobRouter.js";
import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';
import cloudinary from "cloudinary";
import path from "path";


//starting express app
const app = express();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const _dirname = path.resolve();



//configuring dotenv to use the environment variables
dotenv.config({ path: ".env" });

// setting cors to communicate with frontend

app.use(cors({
    origin: ["https://jobseeking-application-47wk.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
//setting cookie parser to parse the cookies from the request
app.use(cookieParser());

//setting express to use json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting file upload to use temp files
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//setting routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/job", jobRouter);


//connecting to database
dbConnection();


//setting error middleware
app.use(errorMiddleware)
// Serve static frontend assets in production
// if (process.env.NODE_ENV === 'production') {
//     const path = require('path');

//     // Serve the frontend build
//     app.use(express.static(path.join(__dirname, 'frontend', 'build')));

//     // Serve the index.html for any other route
//     app.get('*', (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//     });
//   }
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get("*", (req, res) => {
    // res.send("<H1>Page not found.</H1>");
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})