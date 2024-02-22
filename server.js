const mongoose = require("mongoose")
const express = require('express')
const app = express()
const authRouter = express.Router()
const userRouter = require('./routes/userRoute')

const port = process.env.SERVER_PORT | 3000

app.use('/api', userRouter)

mongoose.connect('mongodb://127.0.0.1:27017/otpdb')
app.listen(port, ()=>{
  console.log(`Server is Up on port ${port}`)
})