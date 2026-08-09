import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/register',authController.registerUser)
router.post('/login',authController.loginUser)
router.get('/me',auth(Role.ADMIN,Role.CUSTOMER,Role.PROVIDER),authController.myProfile)





export const authRouter = router