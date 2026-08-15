import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { categoryController } from "./category.controller";


const router = Router()

router.post('/',auth(Role.ADMIN),categoryController.createCategory)
router.get('/',auth(Role.ADMIN),categoryController.getAllCategory)
router.patch('/:id',auth(Role.ADMIN),categoryController.updateCategory)
router.delete('/:id',auth(Role.ADMIN),categoryController.deleteCategory)







export const categoryRouter = router