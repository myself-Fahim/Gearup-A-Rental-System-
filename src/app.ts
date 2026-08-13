import express, { type Application } from 'express'
import { not_found } from './middleware/not_found';
import { globarErrorHandler } from './middleware/global-error';
import { authRouter } from './modules/auth/auth.route';
import { gearRouter } from './modules/gear/gear.route';
import { orderRoute } from './modules/order/order.route';
import { reviewRouter } from './modules/review/review.route';
import { userRouter } from './modules/user/user.route';
const app: Application = express();
app.use(express.json())


app.get('/',  (req, res) => {
    res.send('Server is Running')
})

app.use('/api/auth',authRouter)
app.use('/api/gear',gearRouter)
app.use('/api/orders',orderRoute)
app.use('/api/reviews',reviewRouter)
app.use('/api/user',userRouter)

app.use(globarErrorHandler)
app.use(not_found)

export default app;