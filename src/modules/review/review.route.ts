import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router = Router();

router.post('/',auth(Role.CUSTOMER),reviewController.createReview)






export const reviewRouter = router