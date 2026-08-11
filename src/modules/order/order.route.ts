import { Router } from "express"
import { orderController } from "./order.controller"
import { Role } from "../../../prisma/generated/prisma/enums"
import { auth } from "../../middleware/auth"

const router = Router()
router.get('/myorder',auth(Role.CUSTOMER),orderController.getMyOrder)
router.post('/',auth(Role.CUSTOMER),orderController.createOrder)
router.get('/details/:id',auth(Role.CUSTOMER),orderController.getOrderById) 

export const orderRoute = router