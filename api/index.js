import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'// Import userRouter from the user.route.js file but i export the routerin the file but in the index.js file i am importing it as userRouter, i can change the name of import because it is a default export,in case of default export we can import it with any name we want, but in case of named export we have to import it with the same name as it is exported. 

dotenv.config()

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err)
})

const PORT = 3000;
const app = express()

app.use("/api/user", userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})