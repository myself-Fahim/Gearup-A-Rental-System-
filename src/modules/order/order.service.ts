import { da, tr } from "zod/locales"
import prisma from "../../lib/prisma"
import { AppError } from "../../utils/app-error"
import type { CreateOrderInput } from "./order.validation"
import { gearService } from "../gear/gear.service"
import { includes } from "zod"

const getMyOrder = async (customer_id: string) => {
    const myOrder = await prisma.order.findMany({
        where: {
            customer_id
        },
        include: {
            gear: {
                select:{
                    name:true,
                }
            }
        }

    })

    return myOrder

}

const getOrderById = async(id :string ) =>{
    const order = await prisma.order.findUnique({
        where:{
            id
        },
        include:{
            gear:true
        }
    })
    return order
}

// const getGearCategories = async() =>{

// }

const createOrder = async (order: CreateOrderInput, customer_id: string) => {
    const gear = await gearService.getGearById(order.gear_id)
    if (!gear) {
        throw new AppError(404, 'Gear not found')
    }

    const overlapping = await prisma.order.findFirst({
        where: {
            gear_id: order.gear_id,
            status: {
                not: "CANCELED"
            },
            startDate: {
                lte: order.endDate
            },
            endDate: {
                gte: order.startDate
            }
        }
    })

    if (overlapping) {
        throw new AppError(409, 'Gear is already booked')
    }

    const newOrder = await prisma.order.create({
        data: {
            gear_id: order.gear_id,
            customer_id,
            startDate: order.startDate,
            endDate: order.endDate,
            total_amount: Math.ceil((order.endDate.getTime() - order.startDate.getTime()) / (24 * 60 * 60 * 1000)) * Number(gear.price_per_day)
        }

    })

    return newOrder



}

// const updateGear = async(data : UpdateGearInput , id:string) =>{


// }



export const orderService = {
    createOrder,
    getMyOrder,
    getOrderById

}