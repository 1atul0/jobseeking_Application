import express from 'express';
import { getAllJobs,postJob,getMyJobs,updateJob,deleteJob ,getAJob} from "../controllers/jobController.js"
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.get('/getall', getAllJobs);
router.post('/post',isAuthorized,postJob);
router.get('/getmyjobs',isAuthorized,getMyJobs);
router.get("/:id",isAuthorized,getAJob)
router.put('/update/:id',isAuthorized,updateJob);
router.delete('/delete/:id',isAuthorized,deleteJob);
export default router;