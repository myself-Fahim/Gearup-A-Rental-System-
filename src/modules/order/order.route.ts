import { Router } from "express"
import { orderController } from "./order.controller"
import { Role } from "../../../prisma/generated/prisma/enums"
import { auth } from "../../middleware/auth"

const router = Router()

router.get('/',auth(Role.ADMIN),orderController.getAllOrder)
router.get('/myorder',auth(Role.CUSTOMER),orderController.getMyOrder)
router.post('/',auth(Role.CUSTOMER),orderController.createOrder)
router.get('/provider/orders',auth(Role.PROVIDER),orderController.getProviderOrder) 
router.patch('/provider/orders/:id',auth(Role.PROVIDER),orderController.updateOrderStatusByProvider) 
router.get('/details/:id',auth(Role.CUSTOMER),orderController.getOrderById) 

export const orderRoute = router