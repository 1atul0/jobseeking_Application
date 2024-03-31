import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import applicationRouter from "./routes/applicationRouter.js"
import jobRouter from "./routes/jobRouter.js";
import { dbConnection } from './database/dbConnection.js';
import  { errorMiddleware } from './middlewares/error.js';
//starting express app
const app = express();

//configuring dotenv to use the environment variables
dotenv.config({ path: "./config/config.env" });

// setting cors to communicate with frontend
app.use(cors({
    origin: [process.env.FRONTEND_URL],
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
//exporting app
export default app;