import express from 'express'
import { test } from '../controllers/user.controller.js'

const router = express.Router()

// Define your user-related routes here
router.get('/', test)

export default router