import { da, tr } from "zod/locales"
import prisma from "../../lib/prisma"
import { AppError } from "../../utils/app-error"
import type { CreateOrderInput, UpdateOrderStatusInput } from "./order.validation"
import { gearService } from "../gear/gear.service"
import { includes } from "zod"



const getAllOrder = async() =>{
    const orders = await prisma.order.findMany()
    return orders;

}

const getMyOrder = async (customer_id: string) => {
    const myOrder = await prisma.order.findMany({
        where: {
            customer_id
        },
        include: {
            gear: {
                select: {
                    name: true,
                }
            }
        }

    })

    if (myOrder.length == 0 || !myOrder) {
        throw new AppError(404, 'No order found')
    }
    else
        return myOrder

}
const getProviderOrder = async (providerID: string) => {
    const myOrder = await prisma.order.findMany({
        where: {
            gear: {
                provider_id: providerID
            }
        },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true
                }
            }
        }


    })
    if (!myOrder || myOrder.length == 0) {
        throw new AppError(404, 'No incoming order')
    }
    return myOrder

}

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            gear: true
        }
    })
    if (!order) {
        throw new AppError(404, `Order doesn't exist`)
    }
    return order
}



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

const updateOrderStatus = async (orderID: string, providerID: string, data: UpdateOrderStatusInput) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderID
        }
    })

    if (!order) {
        throw new AppError(404, "Order doesn't exist")
    }

    const providerOrder = await prisma.order.findFirst({
        where: {
            id: orderID,
            gear: {
                provider_id: providerID
            }
        }
    })

    if(!providerOrder){
        throw new AppError(404, "Only gear owner can update the status")
    }

    const updateOrder = await prisma.order.update({
        where: {
            id: orderID
        },
        data: {
            status: data.status
        }
    })
    return updateOrder


}






export const orderService = {
    createOrder,
    getMyOrder,
    getOrderById,
    getProviderOrder,
    updateOrderStatus,
    getAllOrder

}