import z from "zod";

export const createGearSchema = z.object({
    category_id : z.string().min(1,"Category is required"),
    name : z.string().min(1,"Name is required"),
    price_per_day: z.number().positive("Price per day is required"),
    available_stock : z.int().positive("Stock is required")
})
export const updateGearSchema = z.object({
    name : z.string().optional(),
    price_per_day: z.number().positive().optional(),
    available_stock : z.int().optional(),
    is_available : z.boolean().optional()
})

export const allGearFilteringSchema = z.object({
    category_id : z.uuid().optional(),
    max_price : z.coerce.number().optional(),
    min_price : z.coerce.number().optional(),
})


export type CreateGearInput = z.infer<typeof createGearSchema>
export type UpdateGearInput = z.infer<typeof updateGearSchema>
export type allGearFilterParams = z.infer<typeof allGearFilteringSchema>



//  provider_id     String
//     category_id     String
//     name            String
//     price_per_day   Decimal
//     available_stock Int