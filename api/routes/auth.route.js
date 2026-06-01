import express from 'express'
import { google, signin, signup } from '../controllers/auth.controller.js'

const router = express.Router()

// Define your user-related routes here
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)

export default router