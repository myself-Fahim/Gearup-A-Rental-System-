import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { userController } from "./user.controller";


const router = Router();

router.get('/',auth(Role.ADMIN),userController.getAllUser)
router.patch('/profile/:id',auth(Role.ADMIN,Role.CUSTOMER,Role.PROVIDER),userController.updateUser)
router.patch('/:id',auth(Role.ADMIN),userController.updateUserStatus)
router.delete('/:id',auth(Role.ADMIN),userController.deleteUser)





export const userRouter = router