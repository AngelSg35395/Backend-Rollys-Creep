import express from 'express'
import { homeMessage } from '../controllers/rootController.js'

const router = express.Router()

router.get('/', homeMessage)

export default router