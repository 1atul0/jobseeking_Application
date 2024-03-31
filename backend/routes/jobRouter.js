import express from 'express';
import { getAllJobs,postJob,getMyJobs,updateJob,deleteJob } from "../controllers/jobController.js"
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.get('/alljobs', getAllJobs);
router.post('/postjob',isAuthorized,postJob);
router.get('/myJobs',isAuthorized,getMyJobs);
router.put('/updatejob/:id',isAuthorized,updateJob);
router.delete('/deletejob/:id',isAuthorized,deleteJob);
export default router;