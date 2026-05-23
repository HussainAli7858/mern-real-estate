import express from 'express'
import { signup } from '../controllers/auth.controller.js'

const router = express.Router()

// Define your user-related routes here
router.post('/signup', signup)

export default router