import z from "zod";
import { Order_Status } from "../../../prisma/generated/prisma/enums";

export const createOrderSchema = z.object({
    gear_id : z.uuid('Invalid id'),
    startDate : z.coerce.date(),
    endDate : z.coerce.date()
}).refine(input => input.endDate > input.startDate,'End date must be after Start date')


export const updateOrderStatusSchema = z.object({
    status:z.enum(Order_Status)
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>




