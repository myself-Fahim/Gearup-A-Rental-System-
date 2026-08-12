import { Order_Status } from "../../../prisma/generated/prisma/enums"
import prisma from "../../lib/prisma"
import { AppError } from "../../utils/app-error"
import type { CreateReviewInput } from "./review.validation"

const createReview = async (input: CreateReviewInput, customer_id: string) => {
    const geartoReview = await prisma.order.findFirst({
        where: {
            customer_id,
            gear_id: input.gear_id
        }
    })

    if (!geartoReview) {
        throw new AppError(404, "You haven't rent this gear")
    }

    const returnedOrder = await prisma.order.findFirst({
        where: {
            customer_id,
            gear_id: input.gear_id,
            status: Order_Status.RETURNED
        }
    })

    if (!returnedOrder) {
        throw new AppError(400, "You haven't returned this gear yet")
    }



    const review = await prisma.review.create({
        data: {
            user_id: customer_id,
            gear_id: input.gear_id,
            rating: input.rating,
            ...(input.comment !== undefined && {
                comment: input.comment
            })
        }
    })

    return review
}

export const reviewService = {
    createReview
}