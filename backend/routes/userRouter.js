import express from 'express';

import {login, logout, register,getUser,guestLogin} from "../controllers/userController.js"
import {isAuthorized} from "../middlewares/auth.js"
const router = express.Router();

router.get("/guestlogin",guestLogin);
router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthorized, logout);
router.get("/getUser",isAuthorized, getUser);
export default router;