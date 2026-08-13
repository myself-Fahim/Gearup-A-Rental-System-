import { CatchAsync } from "../../utils/catch-async"
import type { Request, Response } from 'express'
import { gearService } from "./gear.service"
import { SendResponse } from "../../utils/send-response"
import z from "zod"
import { allGearFilteringSchema, createGearSchema, updateGearSchema } from "./gear.validation"
import { da, tr } from "zod/locales"


const getAllGear = CatchAsync(async (req: Request, res: Response) => {
    const filterType = allGearFilteringSchema.parse(req.query)
    const result = await gearService.getAllGear(filterType)
    SendResponse(res, 200, {
        success: true,
        message: "Gears retrieve successfully",
        data: result
    })

})

const getGearIdSchema = z.object({
    id: z.uuid()
})

const getGearById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = getGearIdSchema.parse(req.params)
    const result = await gearService.getGearById(id)
    SendResponse(res, 200, {
        success: true,
        message: "Gear retrieve successfully",
        data: result
    })

})

const getGearCategory = CatchAsync(async(req: Request, res: Response) => {
    const result = await gearService.getGearCategories()
     SendResponse(res, 200, {
        success: true,
        message: "Gear categories retrieve successfully",
        data: result
    })

})

const createGear = CatchAsync(async(req: Request, res: Response) => {
    const input = createGearSchema.parse(req.body)
    const result = await gearService.createGear(input,req.user?.id!)
    SendResponse(res,200,{success:true , message:"Gear create successfully",data:result})

})

const updateGearById = CatchAsync(async(req: Request, res: Response) => {
    const data = updateGearSchema.parse(req.body)
    const {id} = getGearIdSchema.parse(req.params)
    const result = await gearService.updateGear(data,id,req.user!.id)
      SendResponse(res, 200, {
        success: true,
        message: "Gear updated successfully",
        data: result
    })
})


const deleteGearById = CatchAsync(async(req: Request, res: Response) => {
    const {id} = getGearIdSchema.parse(req.params)
    const result = await gearService.deleteGear(id,req.user!.id)
    SendResponse(res, 200, {
        success: true,
        message: "Gear deleted successfully",
    })

})

export const gearController = {
    getAllGear,
    getGearCategory,
    getGearById,
    createGear,
    updateGearById,
    deleteGearById
}


