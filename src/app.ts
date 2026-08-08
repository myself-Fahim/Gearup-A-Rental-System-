import express, { type Application } from 'express'
const app: Application = express();
app.use(express.json())



app.get('/',  (req, res) => {
    res.send('Server is Running')
})

export default app;