import z from "zod";

export const createReviewSchema = z.object({
    gear_id: z.uuid('Gear id required'),
    rating: z.int('Rating is required'),
    comment: z.string().optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;