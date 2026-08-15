import { Order_Status, PaymentMethod, PaymentStatus } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import prisma from "../../lib/prisma";
import stripe from "../../lib/stripe";
import { AppError } from "../../utils/app-error";

const CURRENCY = "usd";

const createCheckoutSession =async(
  customerId: string,
  orderId: string,
) =>{
  const order = await prisma.order.findUnique({
       where:{
        id:orderId
       },
       include:{
        gear:{
            include:{
                category:true
            }
        },
        payments:true,
       }
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.customer_id !== customerId) {
    throw new AppError(403, "Forbidden - This is not your order");
  }

  if (order.status !== "PENDING") {
    throw new AppError(400, `Cannot pay for a ${order.status} order`);
  }

  if (order.payments?.status  === PaymentStatus.PAID) {
    throw new AppError(409, "Order is already paid");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { orderId: order.id },
    success_url: `${config.base_url}/payment/success`,
    cancel_url: `${config.base_url}/payment/cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: Math.round(Number(order.total_amount) * 100),
          product_data: {
            name: `${order.gear.name} ${order.gear.category.name}`,
          },
        },
      },
    ],
  });


 await prisma.payment.upsert({
    where: {
        order_id: orderId
    },
    create: {
        order_id: order.id,
        amount: order.total_amount,
        transaction_id: session.id,
        method: PaymentMethod.MOBILE_BANKING,
    },
    update: {
        transaction_id: session.id,
        status: PaymentStatus.PENDING
    }
})
 return { checkoutUrl: session.url };
}


const completePayment =async (order_id: string, transaction_id: string) =>{
  const payment = await prisma.payment.findUnique({ where: { order_id } });

  // stripe re-delivers events, so completing twice must be a no-op
  if (!payment || payment.status === PaymentStatus.PAID) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { order_id },
      data: { status: PaymentStatus.PAID, transaction_id },
    }),
    prisma.order.update({
      where: { id: order_id },
      data: { status: Order_Status.CONFIRM },
    }),
  ]);
}








export const paymentService = {
    createCheckoutSession,
    completePayment
}