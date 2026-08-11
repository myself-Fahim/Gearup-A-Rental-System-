import z from "zod";

export const createOrderSchema = z.object({
    gear_id : z.uuid('Invalid id'),
    startDate : z.coerce.date(),
    endDate : z.coerce.date()
}).refine(input => input.endDate > input.startDate,'End date must be after Start date')

export type CreateOrderInput = z.infer<typeof createOrderSchema>




