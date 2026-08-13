import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router()
router.get('/',gearController.getAllGear)
router.get('/admin',auth(Role.ADMIN),gearController.getAllGearForAdmin)
router.post('/',auth(Role.PROVIDER),gearController.createGear)
router.get('/categories',gearController.getGearCategory) 
router.get('/:id',gearController.getGearById)
router.patch('/:id',auth(Role.PROVIDER),gearController.updateGearById)
router.delete('/:id',auth(Role.PROVIDER),gearController.deleteGearById)






export const gearRouter = router