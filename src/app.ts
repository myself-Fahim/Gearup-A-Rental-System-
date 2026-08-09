import express, { type Application } from 'express'
import { not_found } from './middleware/not_found';
import { globarErrorHandler } from './middleware/global-error';
const app: Application = express();
app.use(express.json())


app.get('/',  (req, res) => {
    res.send('Server is Running')
})


app.use(globarErrorHandler)
app.use(not_found)

export default app;