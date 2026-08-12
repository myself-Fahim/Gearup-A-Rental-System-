import { CatchAsync } from "../../utils/catch-async"
import { SendResponse } from "../../utils/send-response"
import type { Request, Response } from "express"
import { createReviewSchema } from "./review.validation"
import { reviewService } from "./review.service"

const createReview = CatchAsync(async (req: Request, res: Response) => {
    const data = createReviewSchema.parse(req.body)
    const result = await reviewService.createReview(data,req.user!.id)
    
    SendResponse(res, 200,
        {
            success: true,
            message: "Create review successfully",
            data:result
        })
})

export const reviewController = {
    createReview
}