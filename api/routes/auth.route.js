import express from 'express'
import { signin, signup } from '../controllers/auth.controller.js'

const router = express.Router()

// Define your user-related routes here
router.post('/signup', signup)
router.post('/signin', signin)

export default router