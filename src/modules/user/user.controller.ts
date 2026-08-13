import { CatchAsync } from "../../utils/catch-async"
import { SendResponse } from "../../utils/send-response"
import type { Request, Response } from "express"
import { userService } from "./user.service"
import { updateUserSchema, updateUserStatusSchema } from "./user.validation"
import z from "zod"
import { id } from "zod/locales"

const getAllUser = CatchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUser()
    SendResponse(res, 200,
        {
            success: true,
            message: "Create review successfully",
            data:result
        })
})


const userIdSchema = z.object({
    id:z.uuid()
})

const updateUserStatus = CatchAsync(async (req: Request, res: Response) => {
    const data = updateUserStatusSchema.parse(req.body)
    const {id} = userIdSchema.parse(req.params)
    const result = await userService.updateUserStatus(data,id)
    SendResponse(res, 200,
        {
            success: true,
            message: "Update user status successfully",
            data:result
        })
})


const updateUser = CatchAsync(async (req: Request, res: Response) => {
    const data = updateUserSchema.parse(req.body)
    const {id} = userIdSchema.parse(req.params)
    const result = await userService.updateUser(data,id,req.user!.id)
    SendResponse(res, 200,
        {
            success: true,
            message: "User updated successfully",
            data:result
        })
})

const deleteUser = CatchAsync(async (req: Request, res: Response) => {
    const {id} = userIdSchema.parse(req.params)
    const result = await userService.deleteUser(id)
    SendResponse(res, 200,
        {
            success: true,
            message: "Delete user successfully",
            data:result
        })

})





export const userController = {
    getAllUser,
    updateUserStatus,
    deleteUser,
    updateUser
}