import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err)
})

const PORT = 3000;
const app = express()


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})