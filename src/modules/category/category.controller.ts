import { CatchAsync } from "../../utils/catch-async"
import type { Request, Response } from 'express'
import { SendResponse } from "../../utils/send-response"
import { createCategorySchema } from "./category.validation"
import prisma from "../../lib/prisma"
import z from "zod"



const getAllCategory = CatchAsync(async (req: Request, res: Response) => {
    const result = await prisma.category.findMany()
    SendResponse(res, 200, { success: true, message: "Category create successfully", data: result })
})
const createCategory = CatchAsync(async (req: Request, res: Response) => {
    const data = createCategorySchema.parse(req.body)
    const result = await prisma.category.create({
        data
    })
    SendResponse(res, 200, { success: true, message: "Category create successfully", data: result })
})

const categoryIdSchema = z.object({
    id: z.uuid('Invalid Id')
})


const deleteCategory = CatchAsync(async (req: Request, res: Response) => {
    const { id } = categoryIdSchema.parse(req.params);
    const result = await prisma.category.delete({
        where: {
            id
        }
    })
    SendResponse(res, 200, { success: true, message: "Category delete successfully" })
})


const updateCategory = CatchAsync(async (req: Request, res: Response) => {
    const { id } = categoryIdSchema.parse(req.params);
    const data = createCategorySchema.parse(req.body)
    const result = await prisma.category.update({
        where: {
            id
        },
        data

    })
    SendResponse(res, 200, { success: true, message: "Category update successfully", data: result })
})



export const categoryController = {
    createCategory,
    deleteCategory,
    updateCategory,
    getAllCategory
}