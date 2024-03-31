import express from 'express';
const router = express.Router();
import { employerGetAllApplications, jobSeekerGetAllApplications, jobSeekerDeleteApplications,postApplication } from "../controllers/applicationController.js"
import { isAuthorized } from '../middlewares/auth.js';

router.get('/employer/getAll', isAuthorized, employerGetAllApplications);
router.get('/jobseeker/getAll', isAuthorized, jobSeekerGetAllApplications);
router.delete('/delete/:id', isAuthorized, jobSeekerDeleteApplications);
router.post("/post",isAuthorized,postApplication)
export default router;