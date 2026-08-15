import express, { type Application } from 'express'
import { not_found } from './middleware/not_found';
import { globarErrorHandler } from './middleware/global-error';
import { authRouter } from './modules/auth/auth.route';
import { gearRouter } from './modules/gear/gear.route';
import { orderRoute } from './modules/order/order.route';
import { reviewRouter } from './modules/review/review.route';
import { userRouter } from './modules/user/user.route';
import paymentRouter from './modules/payment/payment.route';
import { paymentController } from './modules/payment/payment.controller';
import cookieParser from "cookie-parser";
import { categoryRouter } from './modules/category/category.route';
import cors from 'cors'

const app: Application = express();

app.post("/payments/webhook", express.raw({ type: "application/json" }),paymentController.webhook);
app.use(cors())
app.use(express.json())
app.use(cookieParser());


app.get('/',  (req, res) => {
    res.send('Server is Running')
})

app.use('/api/auth',authRouter)
app.use('/api/gear',gearRouter)
app.use('/api/orders',orderRoute)
app.use('/api/reviews',reviewRouter)
app.use('/api/user',userRouter)
app.use('/api/payments',paymentRouter)
app.use('/api/categories',categoryRouter)

app.use(globarErrorHandler)
app.use(not_found)

export default app;