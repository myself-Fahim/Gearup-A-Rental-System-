import { CatchAsync } from "../../utils/catch-async"
import type { Request, Response } from 'express'
import { orderService } from "./order.service"
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation"
import z from "zod"
import { SendResponse } from "../../utils/send-response"
import { id } from "zod/locales"



const createOrder = CatchAsync(async (req: Request, res: Response) => {
    const input = createOrderSchema.parse(req.body)
    const result = await orderService.createOrder(input, req.user!.id)
    SendResponse(res, 201,
        {
            success: true,
            message: "Order created successfully",
            data: result
        })
})

const getMyOrder = CatchAsync(async (req: Request, res: Response) => {
    const result = await orderService.getMyOrder(req.user!.id)
    SendResponse(res, 200,
        {
            success: true,
            message: "Order retrieve successfully ",
            data: result
        })
})

const getProviderOrder = CatchAsync(async (req: Request, res: Response) => {
    const result = await orderService.getProviderOrder(req.user!.id)
    SendResponse(res, 200,
        {
            success: true,
            message: "Order retrieve successfully ",
            data:result
        })

})

const OrderIdSchema = z.object({
    id: z.uuid()
})

const getOrderById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = OrderIdSchema.parse(req.params)
    const result = await orderService.getOrderById(id)
    SendResponse(res, 200,
        {
            success: true,
            message: "Order retrieve successfully ",
            data: result
        })
})

const updateOrderStatusByProvider  = CatchAsync(async (req: Request, res: Response) => {
    const { id } = OrderIdSchema.parse(req.params)
    const data = updateOrderStatusSchema.parse(req.body)
    const result = await orderService.updateOrderStatus(id,req.user!.id,data)
    SendResponse(res, 200,
        {
            success: true,
            message: "Order status updated successfully",
            data: result
        })
})

export const orderController = {
    createOrder,
    getMyOrder,
    getOrderById,
    getProviderOrder,
    updateOrderStatusByProvider
}