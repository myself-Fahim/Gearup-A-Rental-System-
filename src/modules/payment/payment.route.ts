import { Router, type IRouter } from "express";

import { checkout, getMyPayments, paymentController } from "./payment.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";

const paymentRouter: IRouter = Router();

paymentRouter.post("/checkout/:id", auth(Role.CUSTOMER), paymentController.checkout);
paymentRouter.get("/my", auth(Role.CUSTOMER), getMyPayments);

export default paymentRouter;