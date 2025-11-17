import express from 'express'
import {
    getAdministrators,
    deleteAdministrator
} from '../controllers/administratorsController.js'


const router = express.Router()

// Get Administrators
router.get('/', getAdministrators)

// Delete Administrator
router.delete('/delete/:admin_code', deleteAdministrator)

export default router