import type { Request, Response } from "express";
import { z } from "zod";
import stripe from "../../lib/stripe";
import config from "../../config";
import { AppError } from "../../utils/app-error";
import prisma from "../../lib/prisma";
import { CatchAsync } from "../../utils/catch-async";
import { SendResponse } from "../../utils/send-response";
import { paymentService } from "./payment.service";
import { PaymentStatus } from "../../../prisma/generated/prisma/enums";
import type Stripe from "stripe";


const orderIdParamSchema = z.object({
  id: z.uuid("invalid order id"),
});

export const checkout = CatchAsync(async (req: Request, res: Response) => {
  const {id} = orderIdParamSchema.parse(req.params);

  const result = await paymentService.createCheckoutSession(req.user!.id, id);

  SendResponse(res,201, {success:true, message: "Checkout session created", data: result });
});

export const getMyPayments = CatchAsync(async (req: Request, res: Response) => {
  const payments = await prisma.payment.findMany({
    where: { order: { customer_id: req.user!.id } },
    include: { order: { include: { gear: true } } },
  });

  SendResponse(res,200,{
    success:true,
    message: "Payments retrieved successfully",
    data: { payments },
  });
});

const webhook = CatchAsync(async (req: Request, res: Response) => {

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new AppError(400, "Missing stripe-signature header");
  }

  let event:Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret,
    );
  } catch {
    throw new AppError(400, "Invalid webhook signature");
  }

  const session = event.data.object as { id: string; metadata?: { orderId?: string } };
  const orderId = session.metadata?.orderId;

  if (orderId) {
    if (event.type === "checkout.session.completed") {
      await paymentService.completePayment(orderId, session.id);
    } else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      await prisma.payment.updateMany({
        where: { order_id:orderId, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.FAILED },
      });
    }
  }

  // always 200 once the signature checks out, otherwise stripe retries forever
  res.json({ received: true });
});


export const paymentController = {
    checkout,
    webhook
}