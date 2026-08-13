import z, { email } from "zod";
import { User_status } from "../../../prisma/generated/prisma/enums";

export const updateUserStatusSchema = z.object({
    status:z.enum(User_status)
})


export const updateUserSchema = z.object({
    name:z.string().optional(),
    email:z.string().optional(),
    image_url : z.string().optional()
})



export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
